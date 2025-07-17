const cron = require("node-cron")
const ConnectionRequest = require("../models/connectionRequest")
const { subDays,startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("../utils/sendEmail")

cron.schedule('1 6 * * *', async()=>{
    const yesterday = subDays(new Date(), 1)
    const yesterdayStart  = startOfDay(yesterday)
    const yesterdayEnd = endOfDay(yesterday)
    const interestedConnectionRequest = await ConnectionRequest.find({
        status: 'interested',
        createdAt:{
            $gte: yesterdayStart,
            $lte: yesterdayEnd
        }
    }).populate("senderId receiverId")
        const listOfEmail = [... new Set(interestedConnectionRequest.map((request)=> request.senderId.emailId))]
        for(const email of listOfEmail){
            try {
                const subject = `New request pending from ${email}`
                const body = "There are many pending connection requests, Please login to matchalorie.life to view the requests"
                const request  =await sendEmail.run(subject, body)
                console.log(request)
            } catch (error) {
                return new Error("Something went wrong")
            }
        }
})

