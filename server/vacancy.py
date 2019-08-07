from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import os, sys

## TODO: figure out how to convert # of bathrooms to # of full and half bathrooms
## TODO: not sure what ComGrdFlr is
## TODO: price is Unicode string in DB, should convert to float

app = Flask(__name__)
cors = CORS(app, resources={r"/filter": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

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

class Vacancy(db.Model):
    """
    Model for Vacancy records
    """
    __tablename__ = 'vacant'
    id = db.Column('FID',db.Integer, primary_key=True)
    nhd_name = db.Column('NHD_NAME',db.Unicode)
    lot_type = db.Column('VacCatText',db.Unicode)
    full_bath = db.Column('ResFullBat',db.Integer)
    half_bath = db.Column('ResHlfBath',db.Integer)
    com_grd_flr = db.Column('ComGrdFlr',db.Integer)
    size_sqFt = db.Column('SqFt',db.Float)
    acres = db.Column('Acres',db.Float)
    price = db.Column('VB',db.Unicode)

    def __repr__(self):
        """returns a printable representation of the object"""
        return f"Vacancy('{self.id}','{self.nhd_name}','{self.lot_type}', \
                        '{self.full_bath}','{self.half_bath}','{self.com_grd_flr}'\
                        '{self.size_sqFt}','{self.acres}','{self.price}')"

class VacancySchema(ma.ModelSchema):
    """
    Marshmallow model schema to help serialize complex Python class to JSON
    """
    class Meta:
        model = Vacancy

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


@app.route('/get_first', methods=["GET"])
def data_first():
    """
    Returns first record in database (for debugging)
    """
    one_vacancy = Vacancy.query.first()
    output = vacancies_schema.dump(one_vacancy).data
    return jsonify({'user' : output})

@app.route('/get_all', methods=["GET"])
def data_dump():
    """
    Returns all records in database (for debugging)
    """
    vacancies = Vacancy.query.all()
    output = vacancies_schema.dump(vacancies).data
    return jsonify({'user' : output})

@app.route('/filter', methods=["POST"])
def query():
    """
    Reads JSON and returns matching records from database
    Input JSON Example:
    {
    	"Neighborhoods" : ["Near North Riverfront","Kosciusko"],
    	"LotType" : 2,
    	"IncludePossible" : true,
    	"NumberOfBaths" : 1.5,
    	"SqFtMin" : 0,
    	"SqFtMax" : 10000,
    	"PriceMin" : 0,
    	"PriceMax" : 10000
    }
    note:  LotType is a integer where 0 = both, 1 = lots, 2 = buildings
    """
    req_data = request.get_json()
    # initialize
    NumberOfBaths,LotType,SqFtMin,SqFtMax,PriceMin,PriceMax = None,None,None,None,None,None
    Neighborhoods = []
    IncludePossible = False
    # parse json attributes
    if "Neighborhoods" in req_data:
        Neighborhoods = req_data['Neighborhoods']
    if "LotType" in req_data:
        LotType = req_data['LotType']
    if "IncludePossible" in req_data:
        IncludePossible = req_data['IncludePossible']
    if "NumberOfBaths" in req_data:
        NumberOfBaths = req_data['NumberOfBaths']
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
    print("Query Filters:\n\tNeighborhoods: {}\n\tLotType: {}\n\tNumberOfBaths: {}\
            \n\tSqFt: {} - {}\n\tPirce: {} - {}"\
    .format(Neighborhoods,lot_type_list,NumberOfBaths,SqFtMin,SqFtMax,PriceMin,PriceMax))

    # Query DB
    qryresult = Vacancy.query.filter(Vacancy.nhd_name.in_(Neighborhoods),\
                                    Vacancy.lot_type.in_(lot_type_list),\
                                    Vacancy.size_sqFt >= SqFtMin,\
                                    Vacancy.size_sqFt <= SqFtMax).all()

    # Uncomment below to print query results to console
    # for x in qryresult:
    #     print(repr(x))

    # output query result JSON
    output = vacancies_schema.dump(qryresult).data
    return jsonify({'user' : output})


# entry point
if __name__ == '__main__':
    app.run(debug=True)
