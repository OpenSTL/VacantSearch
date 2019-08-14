#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Jun 28 21:03:18 2018

@author: andrewcady
"""

import pandas as pd
import numpy as np

ss = pd.read_csv('Prcls_NbrhdAssFront.csv')
prices = pd.read_csv('LRA Price List.csv')
#df = pd.read_csv('VacantParcels_updated20180615.csv')
df = pd.read_csv('FinalVacant_LRA_20180707.csv')
#sqft_df = pd.read_csv('Parcel_SquareFeet.csv')

#sqft_df.drop_duplicates('HANDLE',inplace=True)

ss['Nbrhd'] = pd.to_numeric(ss['Nbrhd'],'coerce','integer')
ss['AsrNbrhd'] = pd.to_numeric(ss['AsrNbrhd'],'coerce','integer')
ss['HANDLE'] = pd.to_numeric(ss['HANDLE'],'coerce','integer')
ss.drop_duplicates(subset = ['HANDLE','Nbrhd','AsrNbrhd'],inplace=True)

df['HANDLE'] = pd.to_numeric(df['HANDLE'],'coerce','integer')
df.drop_duplicates(subset='HANDLE',inplace=True)

for col in ['Vacant Land Sq. Ft. Price',
            'Vacant Vandalized Residential Buildings per Unit',
            'Residential New Construction',
            'Side Lots']:
    strCol = prices[col].str.replace(',','')
    prices[col] = pd.to_numeric(strCol.str.replace('$',''),'coerce','integer')
prices['Neigh #'] = pd.to_numeric(prices['Neigh #'].fillna(method='ffill'),'coerce','integer')
prices['Neighborhood Name'] = prices['Neighborhood Name'].fillna(method='ffill').astype(str)
prices['Assessors Neigh'] = pd.to_numeric(prices['Assessors Neigh'].str.strip('*'),'coerce','integer')
prices.drop_duplicates(subset = ['Neigh #','Assessors Neigh'],inplace=True)

#now add in neighborhood averages
AsrNbrhd_means = prices.groupby('Assessors Neigh').mean().reset_index()
AsrNbrhd_means['LnkCol'] = AsrNbrhd_means['Assessors Neigh'].astype(int)
Nbrhd_means = prices.groupby('Neigh #').mean().reset_index()
Nbrhd_means['LnkCol'] = Nbrhd_means['Neigh #'].astype(int) * 1000
prices.dropna(subset = ['Assessors Neigh'],inplace=True)
prices['LnkCol'] = prices['Assessors Neigh'].astype(int) + (prices['Neigh #'].astype(int) * 1000)
aug_prices = pd.concat([prices,AsrNbrhd_means,Nbrhd_means])

#also add a priceMatchType column
#first, match on exact neighborhood-asrNbhd combo
ss['PriceMatchType'] = 'None'
ss['LnkCol'] = (ss['Nbrhd'].astype(int) * 1000) + ss['AsrNbrhd'].astype(int)
ss.loc[ss['LnkCol'].isin(aug_prices['LnkCol']),'PriceMatchType'] = 'Exact'
#next give unmatched records AsrNbhd averages
ss.loc[~ss['LnkCol'].isin(aug_prices['LnkCol']),'LnkCol'] = ss['AsrNbrhd'].astype(int)
ss.loc[(ss['LnkCol'].isin(aug_prices['LnkCol'])) & (ss['PriceMatchType']== 'None'),'PriceMatchType'] = 'AsrNbrhd'
#finally, match all remaining records to neighborhood averages
ss.loc[~ss['LnkCol'].isin(aug_prices['LnkCol']),'LnkCol'] = ss['Nbrhd'].astype(int) * 1000
ss.loc[(ss['LnkCol'].isin(aug_prices['LnkCol'])) & (ss['PriceMatchType']== 'None'),'PriceMatchType'] = 'Nbrhd'
ss['ImputedPrice'] = False
ss.loc[ss.PriceMatchType.isin(['AsrNbrhd','Nbrhd']),'ImputedPrice'] = True


combo = ss.merge(aug_prices,how='left',on='LnkCol')
#combo = ss.merge(prices,how='left',left_on=['Nbrhd','AsrNbrhd'],right_on=['Neigh #','Assessors Neigh'])['Side Lots'].describe()
combo.drop(['HandleDbl','Frontage','Nbrhd','Assessors Neigh','Neigh #'],axis=1,inplace=True)

supercombo = df.merge(combo,how='left',on='HANDLE')
assert ss.shape[0] == combo.shape[0]

#supercombo['SqFt'] = supercombo.merge(sqft_df,how='left',on='HANDLE')['SqFt']

##################################
#### Vacant Building #############
supercombo['bldg_price'] = (supercombo['ResUnits']*supercombo['Vacant Vandalized Residential Buildings per Unit'])
#set this price to -1 if price is erroneous
supercombo.loc[(supercombo.ResUnits==0) | #unit is reported to have no units
                supercombo.PriceMatchType.isin([None,'Nbrhd']),'bldg_price'] = -1 #bad price location match
#set this price to 0 if not applicable
supercombo.loc[(supercombo.Owner!='LRA') | #not owned by LRA
                (supercombo.VB_Final!=2),'bldg_price'] = 0 #parcel is an empty lot
supercombo['VB'] = supercombo['bldg_price'].map('${:,.2f}'.format)
supercombo.loc[supercombo.bldg_price==-1,'VB'] = 'Contact LRA'
supercombo.loc[supercombo.bldg_price==0,'VB'] = 'N/A'

#############################################
#### Vacant Lot - New Construction ##########
supercombo['new_construction_price'] = supercombo['Frontage'] * supercombo['Residential New Construction'].astype(float)
#set this price to -1 if price is erroneous
supercombo.loc[(supercombo.Frontage==0 )| # no frontage information
                supercombo.PriceMatchType.isin([None,'Nbrhd']),'new_construction_price'] = -1 #bad price location match
#set this price to 0 if not applicable
supercombo.loc[(supercombo.Owner!='LRA') | #not owned by LRA
                (supercombo.VL_Final!=2),'new_construction_price'] = 0 #parcel has a building on it
supercombo['NC'] = supercombo['new_construction_price'].map('${:,.2f}'.format)
supercombo.loc[supercombo.new_construction_price==-1,'NC'] = 'Contact LRA'
supercombo.loc[supercombo.new_construction_price==0,'NC'] = 'N/A'

#############################################
### Vacant Lot - Side Lot ###################
supercombo['side_lot_price'] = -2
supercombo.loc[supercombo['Frontage']<=25,'side_lot_price'] = (supercombo['Frontage'].values * supercombo['Side Lots'].astype(float)).loc[supercombo['Frontage']<=25]

supercombo.loc[(supercombo.Frontage==0) | # no frontage information
                supercombo.PriceMatchType.isin([None,'Nbrhd']),'side_lot_price'] = -1 #bad price location match
#set this price to 0 if not applicable
supercombo.loc[(supercombo.Owner!='LRA') | #not owned by LRA
                (supercombo.VL_Final!=2),'side_lot_price'] = 0 #parcel has a building on it
supercombo['SL'] = supercombo['side_lot_price'].map('${:,.2f}'.format)
supercombo.loc[supercombo.side_lot_price==-2,'SL'] = 'Ineligible: frontage > 25 ft'
supercombo.loc[supercombo.side_lot_price==-1,'SL'] = 'Contact LRA'
supercombo.loc[supercombo.side_lot_price==0,'SL'] = 'N/A'

#############################################
#### Vacant Lot - Vacant Lot ################
supercombo['vacant_lot_price'] = supercombo['Vacant Land Sq. Ft. Price'] * supercombo.SqFt

supercombo.loc[(supercombo.SqFt==0)|  # no frontage information
                supercombo.PriceMatchType.isin([None,'Nbrhd']),'vacant_lot_price'] = -1 #bad price location match
#set this price to 0 if not applicable
supercombo.loc[(supercombo.Owner!='LRA') | #not owned by LRA
                (supercombo.VL_Final!=2),'vacant_lot_price'] = 0 #parcel has a building on it
supercombo['VL'] = supercombo['vacant_lot_price'].map('${:,.2f}'.format)
supercombo.loc[supercombo.vacant_lot_price==-1,'VL'] = 'Contact LRA'
supercombo.loc[supercombo.vacant_lot_price==0,'VL'] = 'N/A'

pricingCols = ['HANDLE','bldg_price','VB','new_construction_price','NC','side_lot_price','SL','vacant_lot_price','VL']
pricingStrCols = [c for c in pricingCols if len(c)==2] + ['HANDLE']
pricingInfo = supercombo.loc[:,pricingCols]
justStr = pricingInfo.loc[:,pricingStrCols]
pricingInfo.to_csv('parcel_lra_prices_upd.csv')

'''
sftp acady@thard.us
put <file> 
'''


### Now we add an "outcome" column that we can use to sort our houses by
#less than 1 or 2 year LRA_Tenure
OneYrLra = supercombo.LRA_Tenure.isin([0,1,2]).astype(int)
#forestry needing to work on it - VL_D ==1
NoForestryWork = (supercombo.ForYard_10==0).astype(int)
#not condemned CondStruc==1
NotCondemned = (supercombo.CondStruc!=1).astype(int)
#never reported vacant BD_VB17
NotVacant = (supercombo.YrsVacant != 1).astype(int)
#never boarded up VB_E ==1
NeverBoarded = (supercombo.ForBU_10 == 0).astype(int)
#not commercial
notComm = (supercombo.BldgsCom == 0).astype(int)
#owned by LRA
OwnedByLRA = supercombo.OwnerCat == 'LRA'
#is a building (not a lot)
IsBldg = supercombo.PrclHasBld == 1

supercombo.loc[OneYrLra & notComm & NoForestryWork & NotCondemned & NotVacant & NeverBoarded & OwnedByLRA & IsBldg].shape

supercombo['outcomesum'] = (OneYrLra + notComm + NoForestryWork + NotCondemned + NotVacant + NeverBoarded) * 1000
supercombo.loc[~(IsBldg & OwnedByLRA),'outcomesum'] = 0
supercombo.outcomesum.value_counts()

supercombo['CostAprImp'] = pd.to_numeric(supercombo['CostAprImp'].str.replace(',','').str.replace('$','').str.replace('-','').str.strip(),'coerce','integer')
supercombo.CostAprImp.fillna(0,inplace=True)
supercombo['outcome'] =supercombo['outcomesum'] + supercombo['CostAprImp']
#supercombo.loc[OwnedByLRA & IsBldg].OutcomeSum.dropna().shape

#supercombo.loc[OwnedByLRA & IsBldg].sort_values('CostAprImp',ascending=False).CostAprImp.head()

#ResFullBath
##ResHlfBath
 #- add these together to get number of bathrooms
#YrsTaxDelinq

'''
Properties that have been sold:
    property              handle          price
    8406 Lowell St       60190000200      1000
    8452 N. Broadway and 730 Doddridge St  42930000600  42930000700 --> not in our data
    924 Harlan AV       53990001400       1000
'''
drop_cols = ['Residential New Construction','Side Lots',
       'Vacant Land Sq. Ft. Price',
       'Vacant Vandalized Residential Buildings per Unit',
       'SqFt','LnkCol','ImputedPrice','Neighborhood Name']
keep_cols = ['HANDLE','outcomesum','outcome'] + pricingCols

out_df = supercombo.loc[:,keep_cols]
out_df['outcomesum'] == (out_df.outcomesum/1000).astype(int)
print(out_df.head())
out_df.to_csv('outcomes_upd.csv')


supercombo.to_csv('vacantParcels_upd.csv')