from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from sqlalchemy.sql.expression import and_
from sqlalchemy.dialects import mysql

import os, sys
import logging

# TODO: restrict CORS allowed origins

# enable logging for cors
logging.getLogger('flask_cors').level = logging.DEBUG

app = Flask(__name__)
cors = CORS(app, resources={r"/filter": {"origins": "*"},r"/get_one": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_ECHO'] = True

# get Remote DB credentials from settings file
credentials = {}

# get path of this file
filePath = os.path.dirname(os.path.realpath(__file__))
credentialPath = os.path.join(filePath,"../settings.txt")
with open(credentialPath) as f:
    for line in f:
        key, val = line.partition(":")[::2]
        credentials[key.strip()] = val.strip()

# Connect to Remote DB:
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://'+credentials["username"]+':'+credentials["password"]+'@dbopenstl.johnkramlich.com/openstl'


# Order matters: Initialize SQLAlchemy before Marshmallow
db = SQLAlchemy(app)
ma = Marshmallow(app)

class Parcel(db.Model):
    """
    Model for parcel geojson records
    """
    __tablename__ = 'parcels_geojson'
    # Handle for parcel (unique ID for joining with other datasets) - text
    _parcel_id = db.Column('Handle',db.Unicode, primary_key=True)
    # MultiPolygon coordinates
    coordinates = db.Column('coordinates',db.Unicode)

class Vacancy(db.Model):
    """
    Model for Vacancy records
    """
    __tablename__ = 'vacant'
    # Handle for parcel (unique ID for joining with other datasets) - text
    _parcel_id = db.Column('Handle',db.Unicode, db.ForeignKey("parcels_geojson.Handle"), primary_key=True)
    # neighborhood number (codes)
    nbrhd_code = db.Column('Nbrhd',db.Integer)
    # neighborhood name (text)
    nbrhd_name = db.Column('NHD_NAME',db.Unicode)
    # full address
    street_addr = db.Column('SITEADDR',db.Unicode)
    # zip code
    zip = db.Column('ZIP',db.Integer)
    # text description of vacancy category (Vacant Lot, Possible Vacant Lot, Vacant Building, or Possible Vacant Building)
    lot_type = db.Column('VacCatText',db.Unicode)
    # number of full baths
    bath_full = db.Column('ResFullBat',db.Integer)
    # number of half baths
    bath_half = db.Column('ResHlfBath',db.Integer)
    # 1 * FullBath + 0.5 * HalfBath
    bath_total = db.Column('Bath_Total',db.Float)
    # square footage of ground floor
    com_grd_flr = db.Column('ComGrdFlr',db.Integer)
    # number of stories in residential building (translated from code to text)
    num_stories = db.Column('ResStories',db.Unicode)
    # ward number (2010 ward boundaries)
    ward_num = db.Column('Ward10',db.Integer)
    # attic present (0=no; 1=yes)
    attic = db.Column('ResAttic',db.Integer)
    # type of basement, if applicable (full, partial...) / 0 = no basement (translated from code to text)
    basement_type = db.Column('ResBsmt',db.Unicode)
    # exterior wall type of residential building (brick, frame, stone) (translated from code to text)
    wall_material = db.Column('ResExtWall',db.Unicode)
    # type of construction (brick/wood, steel, etc) (translated from code to text)
    construction = db.Column('ComConst',db.Unicode)
    # type of residential building (single family, two family, etc) (translated from code to text)
    bldg_type = db.Column('ResOccType',db.Unicode)
    # garage on site (0=no; 1=yes)
    garage = db.Column('ResGarage',db.Integer)
    # central heating (0=no; 1=yes)
    central_heat = db.Column('ResCH',db.Integer)
    # basement finish status (translated from code to text)
    basement_finished = db.Column('ResBmFin',db.Unicode)
    # square footage of the parcel
    size_sqFt = db.Column('SqFt',db.Float)
    # parcel acreage
    acres = db.Column('Acres',db.Float)
    # LRA purchase price for a vacant building
    price_bldg = db.Column('VB_decimal',db.Float)
    # LRA purchase price for a vacant lot with plans for new construction
    price_lot = db.Column('NC_decimal',db.Float)
    # LRA purchase price for a side lot (purchaser lives next door and frontage is 25 ft or less)
    price_sidelot = db.Column('SL_decimal',db.Float)
    # Last known and documented residential sale price
    price_residential = db.Column('ResSalePri',db.Integer)
    # Get parcel geojson coordinates from Parcel table
    parcel_geojson = db.relationship("Parcel", backref="Vacancy",primaryjoin=(_parcel_id == Parcel._parcel_id))


    def __repr__(self):
        """returns a printable representation of the object"""
        return f"Vacancy('{self._parcel_id}','{self.nbrhd_name}','{self.nbrhd_code}','{self.lot_type}', \
                        '{self.street_addr}','{self.zip}','{self.bath_full}','{self.bath_half}',\
                        '{self.bath_total}','{self.com_grd_flr}','{self.num_stories}','{self.ward_num}',\
                        '{self.attic}','{self.basement_type}','{self.wall_material}','{self.construction}',\
                        '{self.bldg_type}','{self.garage}','{self.central_heat}','{self.basement_finished}',\
                        '{self.size_sqFt}','{self.acres}','{self.price_bldg}','{self.price_lot}','{self.price_sidelot}',\
                        '{self.price_residential}')"

class VacancySchema(ma.ModelSchema):
    """
    Marshmallow model schema to help serialize complex Python class to JSON
    """
    class Meta:
        include_fk = True
        model = Vacancy
    # function to dump only the coordinates column of the Parcel table
    parcel_geojson = ma.Function(lambda obj: obj.parcel_geojson.coordinates)

# initialize Marshmallow schema to serialize JSON
vacancies_schema = VacancySchema(many=True)

def ConvertLotType(aLotType,aIncludePossible):
    """
    Returns a list of strings to query LotType on

    Keyword arguments:
    aLotType -- integer value representing Lot Type -- 0 = both, 1 = Vacant Lot, 2 = Vacant Building
    aIncludePossible -- boolean value, if true will include possible vacant lot or possible vacant building in query strings
    """
    # initialize empty list
    query_strings = []

    if aLotType == 0 or aLotType == 1:
        query_strings.append("Vacant Lot")
        if aIncludePossible:
            query_strings.append("Possible Vacant Lot")

    if aLotType == 0 or aLotType == 2:
        query_strings.append("Vacant Building")
        if aIncludePossible:
            query_strings.append("Possible Vacant Building")

    return query_strings

@app.route('/get_one', methods=["GET"])
def data_first():
    """
    Returns one record with parcel id '10466040140' in database (for debugging)
    """
    one_vacancy = Vacancy.query.filter_by(_parcel_id="10466040140")
    output = vacancies_schema.dump(one_vacancy).data
    return jsonify({'result' : output})

@app.route('/get_all', methods=["GET"])
def data_dump():
    """
    Returns all records in database (for debugging)
    """
    vacancies = Vacancy.query.all()
    output = vacancies_schema.dump(vacancies).data
    return jsonify({'results' : output})

@app.route('/filter', methods=["POST"])
def query():
    """
    Reads JSON and returns matching records from database
    Input JSON Example:
    {
    	"Neighborhoods" : [34,13],
    	"LotType" : 2,
    	"IncludePossible" : true,
    	"NumBathsMin" : 0,
    	"NumBathsMax" : 1000,
    	"SqFtMin" : 0,
    	"SqFtMax" : 10000,
    	"PriceMin" : 0,
    	"PriceMax" : 10000
    }
    note:  LotType is a integer where 0 = both, 1 = lots, 2 = buildings
    note:  IncludePossible = true will return data labeled as "possible" lots or buildings
    """
    req_data = request.get_json()
    # initialize
    NumBathsMin,NumBathsMax,LotType,SqFtMin,SqFtMax,PriceMin,PriceMax = None,None,None,None,None,None,None
    Neighborhoods = []
    IncludePossible = False
    filter_group = []
    # parse json attributes
    if "Neighborhoods" in req_data:
        Neighborhoods = req_data['Neighborhoods']
        # If Neighborhoods list contains 0 (code for ALL neighborhoods)
        # revert Neighborhoods back to empty list
        # TODO: Modify front end to send empty string
        if 0 in Neighborhoods:
            Neighborhoods = []
    if "LotType" in req_data:
        LotType = req_data['LotType']
    if "IncludePossible" in req_data:
        IncludePossible = req_data['IncludePossible']
    if "NumBathsMin" in req_data:
        NumBathsMin = req_data['NumBathsMin']
    if "NumBathsMax" in req_data:
        NumBathsMax = req_data['NumBathsMax']
    if "SqFtMin" in req_data:
        SqFtMin = req_data['SqFtMin']
    if "SqFtMax" in req_data:
        SqFtMax = req_data['SqFtMax']
    if "PriceMin" in req_data:
        PriceMin = req_data['PriceMin']
    if "PriceMax" in req_data:
        PriceMax = req_data['PriceMax']

    # get Lot Type query strings
    lot_type_list = ConvertLotType(LotType,IncludePossible)

    # debug
    print("Query Filters:\n\tNeighborhoods: {}\n\tLotType: {}\n\tNumBaths: {}-{}\
            \n\tSqFt: {} - {}\n\tPirce: {} - {}"\
    .format(Neighborhoods,lot_type_list,NumBathsMin,NumBathsMax,SqFtMin,SqFtMax,PriceMin,PriceMax))

    # if values specified, add to filter group
    if Neighborhoods:
        filter_group.append(Vacancy.nbrhd_code.in_(Neighborhoods))
    if lot_type_list:
        filter_group.append(Vacancy.lot_type.in_(lot_type_list))
    if NumBathsMin:
        filter_group.append(Vacancy.bath_total >= NumBathsMin)
    if NumBathsMax:
        filter_group.append(Vacancy.bath_total <= NumBathsMax)
    if SqFtMin:
        filter_group.append(Vacancy.size_sqFt >= SqFtMin)
    if SqFtMax:
        filter_group.append(Vacancy.size_sqFt <= SqFtMax)

   # Vacancy.price_bldg >= PriceMin,\
   # Vacancy.price_bldg <= PriceMax,\
   # Vacancy.price_lot >= PriceMin,\
   # Vacancy.price_sidelot >= PriceMin,\
   # Vacancy.price_sidelot <= PriceMax,\
   # Vacancy.price_residential >= PriceMin,\
   # Vacancy.price_residential <= PriceMax

    # Query DB
    # qryresult = Vacancy.query.join(Parcel,Vacancy._parcel_id == Parcel._parcel_id).filter(and_(*filter_group)).all()
    print(Vacancy.query.statement.compile(dialect = mysql.dialect()) )
    qryresult = Vacancy.query.filter(and_(*filter_group)).limit(20).all()
    # Uncomment below to print query results to console
    # for x in qryresult:
    #     print(repr(x))

    # output query result JSON
    output = vacancies_schema.dump(qryresult).data
    return jsonify({'results' : output})


# entry point
if __name__ == '__main__':
    app.run(debug=True)
