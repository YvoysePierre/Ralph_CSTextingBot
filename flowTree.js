const nl = '\r\n\r\n';
module.exports = {
    init:{
        text: `${nl}This is the init node!`,
        l:'init_email',
        r:'init_email'
    },
    init_email:{
        text: `${nl}Hello, I'm \`Ralph\` the Canvasser app bot! I'm going to try to help you out. 
        ${nl}First, I need to ask a few questions and have you send me the answers. 
        ${nl}--------------
        ${nl}Please tell me your canvasser app login email address:`,
        l:'init_location',
        r:'init_location'
    },
    init_location:{
        text: `${nl}Please tell me your location:`,
        l:'init_walkbook',
        r:'init_walkbook'
    },
    init_walkbook:{
        text: `${nl}Please tell me your walkbook name:`,
        l:'init_precinct',
        r:'init_precinct'
    },
    init_precinct:{
        text: `${nl}Please tell me your precinct name:`,
        l:'init_phone_model',
        r:'init_phone_model'
    },
    init_phone_model:{
        text: `${nl}Please tell me your phone model:`,
        l:'start',
        r:'start'
    },
    start:{
        text: `${nl}From now on, I'll ask you questions and you can reply with 'yes', 'y', 'no' or 'n'.
        ${nl}-------------- 
        ${nl}Does your Canvasser App Open?`,
        l:'data_save',
        r: 'end_uninstall_reinstall'
    },
    data_save:{
        text: `${nl}Does your data save?`,
        l:'gps_issue',
        r:'free_space'
    },
    gps_issue:{
        text: `${nl}Is there a GPS issue?`,
        l:'pin_fade',
        r:'happy_profit',
    },
    pin_fade:{
        text: `${nl}Do your pins not fade?`,
        l:'end_screenshot',
        r:'wrong_house',
    },
    wrong_house:{
        text: `${nl}Does it load the wrong house under specific settings?`,
        l:'end_clear_searches',
        r:'end_screenshot',
    },
    happy_profit:{
        text: `${nl}Does it load the wrong house under specific settings?`,
        l:'end_cash_in',
        r:'end_explain_happy_profit',
    },
    free_space:{
        text: `${nl}Does yout phone have 80% or more free space?`,
        l:'end_uninstall_reinstall',
        r:'end_contact_rsd',
    },
    
    // End Nodes
    end_screenshot:{
        text: `${nl}Please take a screenshot of the issue and email it to Manis@wsnrg.com.`,
        l:'end_resolution_n',
        r:'end_resolution_n',
    },
    end_clear_searches:{
        text: `${nl}Please clear any searches you have. This should resolve the issue. If not, uninstall and reinstall the app. 
        ${nl}Does this resolve your issue?`,
        l:'end_resolution_y',
        r:'end_resolution_n',
    },
    end_uninstall_reinstall:{
        text: `${nl}Please uninstall and reinstall the app. 
        ${nl}Does this resolve your issue?`,
        l:'end_resolution_y',
        r:'end_resolution_n',
    },
    end_contact_rsd:{
        text: `${nl}Please contact your RFD and Manis Pierre. 
        ${nl}Does this resolve your issue?`,
        l:'end_resolution_y',
        r:'end_resolution_n',
    },
    end_resolution_n:{
        text: `${nl}Sorry, that's all I know how to do right now... 
        ${nl}I guess I will just restart now.`,
        l:'init',
        r:'init',
    },
    end_resolution_y:{
        text: `${nl}Great! Thanks for chatting! 
        ${nl}Feel free to message me again.`,
        l:'init',
        r:'init',
    },
};