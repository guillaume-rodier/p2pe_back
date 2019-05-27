

# API routing P2PE 

## USERS:

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

__update the specified proposed service__
put 
/proposed_services/:id/	
body: {
name
description
price
}

__Deletes the specified proposed service__
delete
/proposed_services/:id		

get 
__Get the specified proposed service/proposed_services/:id__
 

##PRO:
__Get all the proposed services of the specified pro__
get 
/pro/:id_pro/proposed_services	

__Update the state for every services proposed by a specific Pro__
put
/pro/:id_pro/proposed_services/state	



##Requested:
__Create request:__
POST : 
/requested_services

body : 
{
address,
id_user,
id_proposed
}
__Update state  requested :__
requested_services/:id/state
PUT
body : { state }
 
__UPDATE PAID :__
PUT
/requested_services/:id/paid
body : {
state
}

__DELETE__
/requested_services/:id

__GET POUR PRO :__
/pro/:id/requested_services/extend
/pro/:id/requested_services/

##USER :

__GET requested_services__
/users/:id/requested_services/extend
/users/:id/requested_services
