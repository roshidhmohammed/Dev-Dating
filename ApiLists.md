# APIs Lists

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- GET /profle/edit
- GET /profile/password  - forgot password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /connections
- GET /requests/received
- GET /requests/feed - Get me the profiles of other users on the platform based on the bio filtered preference


## Matched connections
-GET /requests/match/:requestID
-SOCKET - Two Way Communication

## User
- GET /user/notifications
- POST /user/payment/send
- GET /user/payment/received

status: ignored, interested, accepted, rejected