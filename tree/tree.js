/*
 This file contains the logical nodes for the bot's binary tree
 Each node has a top level name like 'data_save'

 Each node has 3 properties:
 'text' which defines the question text
 'l' which defines the name of the lop level 'yes' node
 'r' which defines the name of the lop level 'no' node

 Each l and r node must match up to a real existing top level node

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
        text: `Hello, I'm \`Ralph\` the Canvasser app bot! I'm going to try to help you out. 
        ${nl}First, I need to ask a few questions and have you send me the answers. 
        ${nl}--------------
        ${nl}Please tell me your canvasser app login email address:`,
        l:'init_location',
        r:'init_location'
    },
    init_location:{
        text: `Please tell me your location:`,
        l:'init_walkbook',
        r:'init_walkbook'
    },
    init_walkbook:{
        text: `Please tell me your walkbook name:`,
        l:'init_precinct',
        r:'init_precinct'
    },
    init_precinct:{
        text: `Please tell me your precinct name:`,
        l:'init_phone_model',
        r:'init_phone_model'
    },
    init_phone_model:{
        text: `Please tell me your phone model:`,
        l:'start',
        r:'start'
    },
    start:{
        text: `From now on, I'll ask you questions and you can reply with 'yes', 'y', 'no' or 'n'.
        ${nl}-------------- 
        ${nl}Does your Canvasser App Open?`,
        l:'data_save',
        r: 'end_uninstall_reinstall'
    },
    data_save:{
        text: `Does your data save?`,
        l:'gps_issue',
        r:'free_space'
    },
    gps_issue:{
        text: `Is there a GPS issue?`,
        l:'pin_fade',
        r:'happy_profit',
    },
    pin_fade:{
        text: `Do your pins not fade?`,
        l:'end_screenshot',
        r:'wrong_house',
    },
    wrong_house:{
        text: `Does it load the wrong house under specific settings?`,
        l:'end_clear_searches',
        r:'end_screenshot',
    },
    happy_profit:{
        text: `Does it load the wrong house under specific settings?`,
        l:'end_cash_in',
        r:'end_explain_happy_profit',
    },
    free_space:{
        text: `Does yout phone have 80% or more free space?`,
        l:'end_uninstall_reinstall',
        r:'end_contact_rsd',
    },
    
    // End Nodes
    end_screenshot:{
        text: `Please take a screenshot of the issue and email it to Manis@wsnrg.com.`,
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
        text: `Please contact your RFD and Manis Pierre. 
        ${nl}Does this resolve your issue?`,
        l:'end_resolution_y',
        r:'end_resolution_n',
    },
    end_cash_in:{
        text: `You are cashing in. (idk what this should say) 
        ${nl}Does this resolve your issue?`,
        l:'end_resolution_y',
        r:'end_resolution_n',
    },
    end_explain_happy_profit:{
        text: `This is an explanation about happy profit. (idk what this should say) 
        ${nl}Does this resolve your issue?`,
        l:'end_resolution_y',
        r:'end_resolution_n',
    },

    // Resolution nodes
    end_resolution_n:{
        text: `Sorry, that's all I know how to do right now... 
        ${nl}I guess I will just restart now.`,
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