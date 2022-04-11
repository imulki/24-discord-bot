const eris = require('eris');

const PREFIX = '/>';
const bot = new eris.Client("ODg3MjcxODA5MTc3NzYzODQx.YUBuRA.6a4mEPbSzMHIWSweHv3uwUR8p8c"); // OLD TOKEN

const variables = {};
variables["lock"] = true;
variables["msgId"] = '';

const commandHandlerForCommandName = {};
commandHandlerForCommandName["addpayment"] = (msg, args) => {
    const mention = args[0];
    const amount = parseFloat(args[1]);

    return msg.channel.createMessage(`${mention} paid $${amount.toFixed(2)}`);
}

//////////////////////////////////////
//////// AVAILABLE COMMAND ///////////
//////////////////////////////////////
commandHandlerForCommandName["calculate"] = (msg, args) => {
    return msg.channel.createMessage(calculatePostfix(args[0]));
}

commandHandlerForCommandName["changelock"] = (msg, args) => {
    variables["lock"] = !variables["lock"];
    return msg.channel.createMessage(`lock is ${variables["lock"]}`);
}

commandHandlerForCommandName["testemoji"] = async (msg,args) => {
    var createdMsg = await msg.channel.createMessage(`This is testing message`);
    bot.addMessageReaction(msg.channel.id, createdMsg.id, '😀');
    return createdMsg;
}

commandHandlerForCommandName["play"] = (msg,args) => {
    variables["choosenNumber"] = [];
    for (let i = 0; i < 4; i++) {
        variables["choosenNumber"].push(Math.floor(Math.random() * 10));
    }
    return msg.channel.createMessage(`${variables[0]} ${variables[1]} ${variables[2]} ${variables[3]}`);
}

commandHandlerForCommandName["ans"] = (msg, args) => {
    const sum = calculatePostfix(args[0]);
    if (sum != 24) return msg.channel.createMessage("The answer is false");
}

/////////////////////////////////////
///////// HELPING FUNCTION //////////
/////////////////////////////////////
function calculatePostfix(equation) {
    var stack = [];
    var eqArr = equation.split('');
    eqArr.forEach(element => {
        switch (element) {
            case '+':
                var num1 = stack.pop();
                var num2 = stack.pop(); 
                stack.push(num2+num1);
                break;
            case '-':
                var num1 = stack.pop();
                var num2 = stack.pop();
                stack.push(num2-num1);
                break;
            case '*':
                var num1 = stack.pop();
                var num2 = stack.pop();
                stack.push(num2*num1);
                break;
            case '/':
                var num1 = stack.pop();
                var num2 = stack.pop();
                stack.push(num2/num1);
                break;
            default:
                stack.push(parseInt(element));
                break;
        }
    });
    return stack.pop();
}

function checkValidNumbers(requireds, equation) {
    const checkists = equation.split('').map(x => parseInt(x)).filter(x => x !== NaN);
    if (checkists.length != 4) return false;
    for (let i = 0; i<4; i++) {
        const idx = equation.find(checkists.pop());
        if (idx === undefined) return false;
        equation.splice(idx, 1);
    }
    return true;
}

function cloneArray(source) {
    let newArr = [];
    source.forEach(elm => {
        newArr.push(elm);
    });
    return newArr;
}

// When the bot is connected and ready, log to console.
bot.on('ready', () => {
   console.log('Connected and ready.');
});

// Every time a message is sent anywhere the bot is present,
// this event will fire and we will check if the bot was mentioned.
// If it was, the bot will attempt to respond with "Present".;
bot.on('messageCreate', async (msg) => {
   const content = msg.content;

   if (!msg.channel.guild) {
       return;
   }

   if (!content.startsWith(PREFIX)) {
       return;
   }

   const parts = content.split(' ').map(s => s.trim()).filter(s => s);
   const commandName = parts[0].substr(PREFIX.length);

   const commandHandler = commandHandlerForCommandName[commandName];
   if (!commandHandler) {
       return;
   }

   const args = parts.slice(1);

   try {
       await commandHandler(msg, args);
   } catch (err) {
       console.warn("Error handling command");
       console.warn(err);
   }
});

bot.on('error', err => {
   console.warn(err);
});

bot.connect();
