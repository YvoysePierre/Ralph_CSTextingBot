module.exports = {
    init:{
        text:"NA",
        l:'start',
        r: 'start'
    },
    start:{
        text:"Hello, I'm Spock the Canvasser app bot! \r\nI'll ask you questions and you can reply with 'yes', 'y', 'no' or 'n'. \r\n\r\nDoes your Canvasser App Open?",
        l:'data_save',
        r: 'end_uninstall_reinstall'
    },
    data_save:{
        text:"Does your data save?",
        l:'gps_issue',
        r:'free_space'
    },
    gps_issue:{
        text:"Is there a GPS issue?",
        l:'pin_fade',
        r:'happy_profit',
    },
    pin_fade:{
        text:"Do your pins not fade?",
        l:'end_screenshot',
        r:'wrong_house',
    },
    wrong_house:{
        text:"Does it load the wrong house under specific settings?",
        l:'end_clear_searches',
        r:'end_screenshot',
    },
    happy_profit:{
        text:"Does it load the wrong house under specific settings?",
        l:'end_cash_in',
        r:'end_explain_happy_profit',
    },
    free_space:{
        text:"Does yout phone have 80% or more free space?",
        l:'end_uninstall_reinstall',
        r:'end_contact_rsd',
    },
    
    // End Nodes
    end_screenshot:{
        text:"Please take a screenshot of the issue and email it to Manis@wsnrg.com.",
        l:'end_resolution_n',
        r:'end_resolution_n',
    },
    end_clear_searches:{
        text:"Please clear any searches you have. This should resolve the issue. If not, uninstall and reinstall the app. \r\n\r\nDoes this resolve your issue?",
        l:'end_resolution_y',
        r:'end_resolution_n',
    },
    end_uninstall_reinstall:{
        text:"Please uninstall and reinstall the app. \r\n\r\nDoes this resolve your issue?",
        l:'end_resolution_y',
        r:'end_resolution_n',
    },
    end_contact_rsd:{
        text:"Please contact your RFD and Manis Pierre. \r\n\r\nDoes this resolve your issue?",
        l:'end_resolution_y',
        r:'end_resolution_n',
    },
    end_resolution_n:{
        text:"Sorry, that's all I know how to do right now... \r\n\r\nI guess I will just restart now.",
        l:'init',
        r:'init',
    },
    end_resolution_y:{
        text:"Great! Thanks for chatting! \r\n\r\n Feel free to message me again.",
        l:'init',
        r:'init',
    },
};