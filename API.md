

#API routing P2PE 

##USERS:

get /users/:id		//Get user with id

__Create new user

post 
/users		
body: {
  email
  password
  gender
  address
  phone_number
  first_name
  last_name
  role
  company_name
  company_description
  number_employee
  siret
  profession
}

__Update a user (still has to define what needs to be *updatable* for now email, name and password ?)
put 
/users/:id		

__Delete the specified user
delet
/users/:id	

##PROPOSED SERVICES:
__Create new service proposal
post 
/proposed_services	
body: {
	name
description
location
price
option
id_pro
}

__get all the proposed services
get 
/proposed_services	

put /proposed_services/:id/state	//update the state of a specified service (available or not)
body: {
	state
}

__update the specified proposed service
put 
/proposed_services/:id/	
body: {
name
description
price
}

__Deletes the specified proposed service
delete
/proposed_services/:id		

get /proposed_services/:id		//Get the specified proposed service
 state

##PRO:

get /pro/:id_pro/proposed_services	//Get all the proposed services of the specified pro

put /pro/:id_pro/proposed_services/state	//Update the state for every services proposed by a specific Pro


##Requested:
__Create request:
POST : 
/requested_services

body : 
{
address,
id_user,
id_proposed
}
__Update state  requested :
requested_services/:id/state
PUT
body : { state }
 
__UPDATE PAID :
PUT
/requested_services/:id/paid
body : {
state
}

__DELETE
/requested_services/:id

__GET POUR PRO :
/pro/:id/requested_services/extend
/pro/:id/requested_services/

##USER :

__GET requested_services
/users/:id/requested_services/extend
/users/:id/requested_services
