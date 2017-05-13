const storage = require('node-persist'); 
const crypto  = require('crypto-js');
var argv      = require('yargs')
						.command('create','create a use account',(yargs)=>{
							yargs.options({
								name : {
									demand : true,
									alias  : 'ac',
									description : 'users account name',
									type : 'string'
								},
								username :{
									demand : true,
									alias  : 'n',
									description : 'user\'s account name',
									type : 'string'
								},
								password :{
									demand : true,
									alias  : 'p',
									description : 'user\'s account password',
									type : 'string'
								},
								masterPassword : {
									demand : true,
									alias  : 'm',
									description : 'masterPassword',
									type : 'string'
								}
							})
						})
						.command('get','fetch user account',(yargs)=>{
							yargs.options({
								name:{
									demand : true,
									alias  : 'ac',
									description : 'user\'s account'
								},
								masterPassword : {
									demand : true,
									alias  : 'm',
									description : 'masterPassword',
									type : 'string'
								}
							})
						})
						.help('help')
						.argv;

var command = argv._[0];
storage.initSync();
//---------------------------------------------------------------------------------------

function getAccounts(masterPassword){
	//fetch accounts using getItemSync
	//decrypt them
	//return the accounts array
	
	var accounts = [];
	var encryptedAccounts = storage.getItemSync('accounts');
	if(typeof encryptedAccounts !== 'undefined')
	{
	  var decryptedAccounts = crypto.AES.decrypt(encryptedAccounts,masterPassword);
		accounts = JSON.parse(decryptedAccounts.toString(crypto.enc.Utf8));
	}
 
	return accounts;
}
function saveAccounts(accounts,masterPassword){
	//encrypt accounts
	//save them using setItemSync
	//return the accounts array
	var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts),masterPassword);
	//storage.setItemSync('accounts',JSON.parse(encryptedAccounts));
	storage.setItemSync('accounts',encryptedAccounts.toString());

	return accounts;
}

//---------------------------create an account function-----------------------------------
function createAccount(account,masterPassword){
	//var accounts = storage.getItemSync('accounts');
	console.log('Hi');
	var accounts = getAccounts(masterPassword);
	// if(typeof accounts === 'undefined'){
	// 	var accounts = [] ;
	// }
	
	accounts.push(account);

	//storage.setItemSync('accounts',accounts); 
	saveAccounts(accounts,masterPassword);

	return account;
}

///----------------------------fetch account function------------------------ 
function getAccount(accountName,masterPassword){

	// var accounts = storage.getItemSync('accounts');
	var accounts = getAccounts(masterPassword);
  var matchedAccount;

  accounts.forEach((account)=>{             
  	if(account.name === accountName){
  		matchedAccount = account;
  	}
  });

  return matchedAccount;
}

//---------------------------------------------------------------------------

if(command === 'create'){
	try{
		var createdAccount = createAccount({
		'name' : argv.name,
		'username' : argv.username,
		'password' : argv.password
	 }, argv.masterPassword); 
	  console.log('account created');
	 }
	catch(error){
		console.log(error.message);
	}
}
else if(command === 'get'){
	try{
		var fetchedAccount = getAccount(argv.name,argv.masterPassword);
	  if(typeof fetchedAccount === 'undefined'){
		   console.log('account not found');
	   }else
	   {
		   console.log(fetchedAccount);
	   }
	}
	catch(error){
		console.log(error.message);
	}
}
/*
npm start -- get --ac fb
*/
