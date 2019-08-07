# VacantSearch 🏠
## Backend
### Prerequisites
 - **Python** :snake:
   - **Python3** - Python language interpreter
   - **Pip** - Python package manager
   - **Virtualenv** - Python environment manager
 - **Postman** - Tool to send API requests and read responses. [(Get Postman)](https://www.getpostman.com/downloads/)
 - **Login credentials to OpenSTL Database** - Please contact repo owner for credentials

### Installing
 ##### Create virtual environment
 1. Create a Python 3 environment. Replace ``[envname]`` with an environment name that makes sense.
 ```
 virtualenv -p python3 [envname]
 ```
 Once environment is created, run:
 ```
 source [envname]/bin/activate
 ```
 2. In repo directory, run the following command:
 ```
 pip install -r requirements.txt
 ```


 ##### Connect to OpenSTL Database
 1. Get access credentials from repo owner -- you will need a username and a password.
 2. Open `settings.txt` with text editor of choice.
 3. Replace ``[yourUsername]`` and ``[yourPassword]`` with your credentials, then save.
 ```
 username:[yourUsername]
 password:[yourPassword]
 ```
 4. (For Developers) Run the following command to ignore changes in `settings.txt`, so that you don't accidentally commit your user credentials 😛
 ```
 git update-index --assume-unchanged settings.txt
 ```
### Example
1. Open terminal, navigate to `server` sub-directory.
```
cd server/
```
2. Start the backend server locally using following command:
```
python vacancy.py
```
3. Open Postman, create a POST request with the following example JSON:
```
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
```
4. You should get a response JSON with vacancy records that matches the criteria specified in the input JSON.

### Deployment
🚧 Work in Progress 🚧
1. Move `vacancy.service` file into systemd directory.
