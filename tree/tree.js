/*
 This file contains the logical nodes for the bot's binary tree
 
 Node Names:
 
 Each node has a top level name like 'data_save'
 
 This name MUST be unique. 
 
 This name MUST only start with `init_` if it is not a yes/no question
 'init_' nodes MUST have matching 'l' and 'r' pointers

 The node names 'init' is a special node. It's 'text' will never be shown to the user. 
 
 This name MUST only start with `end_` if it is the final node in a tree
 'end_' nodes MUST point to the 'end_resolution_n' and 'end_resolution_y' nodes
 
 The 'end_resolution_n' and 'end_resolution_y' nodes are special nodes that trigger
 admin messages and always return the user to the `init` node
 
 Node Properties:
 'text' which defines the question text
 'l' which defines the name of the lop level 'yes' node
 'r' which defines the name of the lop level 'no' node

 Each 'l' and 'r' node must match up to a real existing top level node

 'l' corresponds to 'yes' and 'r' corresponds to 'no'

 Any answer that does not start with the letter 'y' is determined to be a 'no' answer

 Line Breaks:
 We also have the special 'nl' string which represents a new paragraph break
 This can be used like `${nl}` anywhere in the 'text' property
 Adding regular line breaks in your code editor will NOT add line breaks to the SMS content
 You must use the 'nl' string instead. 
*/
const nl = '\r\n\r\n';
module.exports = {
    init:{
        text: `This is the init node!`,
        l:'init_email',
        r:'init_email'
    },
    init_email:{
        text: `Hello, thanks for sending me your issue. I'm \`Ralph\` the Canvasser app bot, with Manis Pierre at Voter-Science. We're going to help fix your app. 
        ${nl}First, I need to ask a few questions and have you send me the answers. 
        ${nl}--------------
        ${nl}Please tell me your canvasser app login email address:`,
        l:'init_phone_make_model',
        r:'init_phone_make_model'
    },
    init_phone_make_model:{
        text: `Please text me the make and model of your phone:`,
        l:'init_time',
        r:'init_time'
    },
    init_time:{
        text: `Please text me the approximate time the issue occurred:`,
        l:'init_location',
        r:'init_location'
        
    },
    init_location:{
        text: `Please tell me the location the issue first happened:`,
        l:'init_walkbook',
        r:'init_walkbook'
    },
    init_walkbook:{
        text: `Please tell me the walkbook you were in or the walkbook you were attempting to access when the issue occurred:`,
        l:'init_precinct',
        r:'init_precinct'
    },
    init_precinct:{
        text: `Please tell me the precinct you were in or the precinct you were attempting to access when the issue occurred:`,
        l:'init_contact',
        r:'init_contact'
    },
    init_contact:{
        text: `Please text me the best way to reach you in case Manis needs to call or email you:`,
        l:'start',
        r:'start'
    },
    start:{
        text: `From here, I'll ask you questions, please reply with 'yes', 'y', 'no' or 'n'.
        ${nl}-------------- 
        ${nl}Does your Canvasser App remain Open?`,
        l:'data_save',
        r: 'end_uninstall_reinstall'
    },
    data_save:{
        text: `Does your data save while you canvass?`,
        l:'gps_issue',
        r:'free_space'
    },
    gps_issue:{
        text: `Is there a GPS issue or GPS dot issue?`,
        l:'pin_fade',
        r:'happy_profit',
    },
    pin_fade:{
        text: `Do your house pins not fade?`,
        l:'end_screenshot',
        r:'wrong_house',
    },
    wrong_house:{
        text: `Does it load the wrong house pins but right address?`,
        l:'end_clear_searches',
        r:'end_screenshot',
    },
    happy_profit:{
        text: `Does it load the right house pins but wrong address?`,
        l:'end_cash_in',
        r:'end_explain_happy_profit',
    },
    free_space:{
        text: `Does your phone have 80% or more free space?`,
        l:'end_uninstall_reinstall',
        r:'end_contact_rsd',
    },
    
    // End Nodes
    end_screenshot:{
        text: `Please take a screenshot of the issue and email it to Manis@Voter-Science.com.`,
        l:'end_resolution_n',
        r:'end_resolution_n',
    },
    end_clear_searches:{
        text: `Please clear any searches you have. This should resolve the issue. If not, uninstall and reinstall the app. 
        ${nl}Does this resolve your issue?`,
        l:'end_resolution_y',
        r:'end_resolution_n',
    },
    end_uninstall_reinstall:{
        text: `Please uninstall and reinstall the app. 
        ${nl}Does this resolve your issue?`,
        l:'end_resolution_y',
        r:'end_resolution_n',
    },
    end_contact_rsd:{
        text: `Manis will reach out to you as soon as possible. 
        ${nl}We're sorry for any inconvenience`,
        l:'end_resolution_y',
        r:'end_resolution_n',
    },
    end_cash_in:{
        text: `Thank you for using the Canvasser text chat bot.  
        ${nl}We're sorry for any inconvenience`,
        l:'end_resolution_y',
        r:'end_resolution_n',
    },
    end_explain_happy_profit:{
        text: `Thank you for using the Canvasser text chat bot.  
        ${nl}We're sorry for any inconvenience`,
        l:'end_resolution_y',
        r:'end_resolution_n',
    },

    // Resolution nodes
    end_resolution_n:{
        text: `Manis will reach out to you as soon as possible. 
        ${nl}We apologize for any inconvenience.`,
        l:'init',
        r:'init',
    },
    end_resolution_y:{
        text: `Great! Thanks for chatting! 
        ${nl}Feel free to message me again.`,
        l:'init',
        r:'init',
    },
};