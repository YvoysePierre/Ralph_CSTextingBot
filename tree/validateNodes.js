const tree = require('./tree');
module.exports = ()=>{
    let issues = [];
    for(const [key,data] of Object.entries(tree)){
        if(!tree[data.l])
        {
            issues.push(data.l);
        }
        if(!tree[data.r])
        {
            issues.push(data.r);
        }
    }
    return issues;
};