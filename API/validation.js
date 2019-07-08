//This function will check fr basic SQL injection
function checkForBasicSQLInjection(req,res)
{
    
    //SQL injection keywords
    var keyWords = ['delete','select','insert','update']

    
    //Go through all of the request parameters and check for those keywords
    for(var i=0;i<req.params.length;i++)
    {
        for(var j=0;j<keyWords.length;k++)
        {
            if(JSON.stingify(req.params[i]).toLowerCase().indexOf(keyWords[k])!=-1)
            {
                
                return false
            }
            
                
        }
    }
    return true
}

module.exports.checkForBasicSQLInjection = checkForBasicSQLInjection





//This function will return the number of occurrences of a char in a given string
function numberOfCharOccurrences(Str,c)
{
    
    return str.split(c).length - 1
}



/*
    A generic sql script with the following structure

    INSERT INTO 'table' (c1,c2,...)
    VALUES (v1,v2,...)

*/
function addToFavoritesByPOIUsername(req,res)
{
    var  splitParam = returnSplit(req.params.cloumns)
    var  splitValue = returnSplit(req.params.values)

    if(splitParam.length!=2 || splitValue.length!=2)
        return false

    var index =-1
    //index = splitParam.indexOf("")
    
    //Continue
    //Check If the give params are POI and Username
}

//This function will allow to select PointOfInterest ONLY by category
//This function will check if the given query is 'category=
function isPointOfInterestByCategory(req,res)
{
    return onlyBy(req,'categoryName',true) && checkTable(req, 'pointOfInterest')
}

module.exports.isPointOfInterestByCategory = isPointOfInterestByCategory

//This function checks if the syntax for getReviewById is correct
function getReviewByPOI(req,res)
{
    return onlyBy(req,'pointOfInterest',false) && checkTable(req,'reviews')
}


module.exports.getReviewByPOI = getReviewByPOI


//This function checks if the syntax for getReviewById is correct
function getSelectedPhotos(req,res)
{
    return onlyBy(req,'city',true) && checkTable(req,'cityImg')
}
module.exports.getSelectedPhotos = getSelectedPhotos

//This function checks if the syntax for getReviewByPOI is correct
function getRankByPOI(req,res)
{
   
    return onlyBy(req,'name',true) && checkColumn(req,'rank') && checkTable(req,'pointOfInterest')
}
module.exports.getRankByPOI = getRankByPOI

//This function checks if the syntax for getQuestionAndAnswersByUsername
function getQuestionAndAnswersByUsername(req,res)
{
    return onlyBy(req, 'username', true) && checkTable(req,'question_and_answer')
}

module.exports.getQuestionAndAnswersByUsername =getQuestionAndAnswersByUsername


//This function checks if the syntax for getPOIStatistics
function getPOIByName(req,res)
{
   
    return onlyBy(req,'name',false) && checkTable(req,'pointOfInterest')
}
module.exports.getPOIByName = getPOIByName
//This function checks if the given column name in the request is the same as the given 'columnName'
function checkColumn(req,columnName)
{
    
    return JSON.stringify(req.params.column) === ('\"'+columnName+'\"')
}

//This function checks if the given table name in the request is the same as the given 'tableName'
function checkTable(req,tableName)
{
    return JSON.stringify(req.params.table) === ('\"'+tableName+'\"')
}



//This function checks if condition is as followes:
// 'column=value'
//flag is TRUE if we want to check that there are no digits
function onlyBy(req,column,flag)
{
    var squery = JSON.stringify(req.params.query)
    if(squery.length<=column.length+4)
        return false
  
    return squery.substring(1,column.length+1)===column && (!flag || !(/\d/.test(squery))) && squery.charAt(column.length+1)==='='
}

//'/select/:table/:column'
//This function checks if the syntax for getCategories
function isGetFromCategories(req,res)
{
    return checkTable(req,'category')
}
module.exports.isGetFromCategories = isGetFromCategories

//This function checks if the syntax for getCities
function isGetFromCities(req,res)
{
    return checkTable(req,'category')
}
module.exports.isGetFromCities = isGetFromCities

//This function checks if the syntax for getCountries
function isGetFromCountries(req,res)
{
    return checkTable(req,'countries')
}
module.exports.isGetFromCountries = isGetFromCountries

//This function checks if the syntax for removeFromfavorites
function isRemoveFromFavoriets(req,res)
{
    return checkTable(req,'favorites')
}
module.exports.isRemoveFromFavoriets = isRemoveFromFavoriets

//This function will check if the column is in the condition
function isColumnInCondition(req,column)
{
    var parameters = JSON.stringify(req.params.columns)
    var splitted = parameters.split("+")
    splitted[0] = splitted[0].substring(1)
    splitted[splitted.length-1] = splitted[splitted.length-1].substring(0,splitted[splitted.length-1].length-1)

  
    for(var i=0;i<splitted.length;i++)
    {
 
        if(splitted[i]=== column)
            return true
    }
    return false
}

//This function checks if the syntax for AddReview
function isAddReview(req,res)
{
    var columns = JSON.stringify(req.params.columns)
    var splittedP = columns.split("+")
    splittedP[0] = splittedP[0].substring(1)
    splittedP[splittedP.length-1] = splittedP[splittedP.length-1].substring(0,splittedP[splittedP.length-1].length-1)

    
    if(splittedP.length!=3)
        return false

    var values = JSON.stringify(req.params.values)
    var splittedV = values.split("+")
    splittedV[0] = splittedV[0].substring(1)
    splittedV[splittedV.length-1] = splittedV[splittedV.length-1].substring(0,splittedV[splittedV.length-1].length-1)
 
    if(splittedV.length!=3)
        return false
    
    return isColumnInCondition(req,'username') && isColumnInCondition(req,'context') && isColumnInCondition(req,'pointOfInterest')
}

module.exports.isAddReview = isAddReview

//This function checks if the syntax for AddPointOfInterest
function isAddPOI(req,res)
{
    var columns = JSON.stringify(req.params.columns)
    var splittedP = columns.split("+")
    splittedP[0] = splittedP[0].substring(1)
    splittedP[splittedP.length-1] = splittedP[splittedP.length-1].substring(0,splittedP[splittedP.length-1].length-1)
    
    
    var values = JSON.stringify(req.params.values)
    var splittedV = values.split("+")
    splittedV[0] = splittedV[0].substring(1)
    splittedV[splittedV.length-1] = splittedV[splittedV.length-1].substring(0,splittedV[splittedV.length-1].length-1)

    if(!((splittedP.length== 4 || splittedP.length == 5) && splittedP.length==splittedV.length))
        return false
   
    return isColumnInCondition(req,'name') && isColumnInCondition(req,'city') && isColumnInCondition(req,'categoryName') && isColumnInCondition(req,'description') && checkNumberInValues(splittedV,[splittedP.indexOf('description'),splittedP.indexOf('image')])
}
module.exports.isAddPOI= isAddPOI


//This function checks if the syntax for passwordrestoration
function getPasswordByQuestionAndAnswer(req,res)
{

    return checkTable(req,'users') && isColumnInCondition2(req,'username') && isColumnInCondition2(req,'question') && isColumnInCondition2(req,'answer')
}

module.exports.getPasswordByQuestionAndAnswer = getPasswordByQuestionAndAnswer

//This function checks if there is a number in the given array of string
function checkNumberInValues(split,indexes)
{
    for(var i=0;i<split.length;i++)
    {
        
            if(/\d/.test(split[i]) && indexes.indexOf(i)==-1)
                return false
    }
    return true
}

//This function will check if the column is in the condition
function isColumnInCondition2(req,column)
{
    var parameters = JSON.stringify(req.params.query)
    var splitted = parameters.split("+")
    splitted[0] = splitted[0].substring(1)
    splitted[splitted.length-1] = splitted[splitted.length-1].substring(0,splitted[splitted.length-1].length-1)
   
    for(var i=0;i<splitted.length;i++)
    {
      
        if(splitted[i].split("=")[0]=== column)
            return true
    }
    return false
}

//This function checks if the syntax for addQuestionAndAnswer
function isAddQuestionAndAnswer(req,res)
{

    var columns = JSON.stringify(req.params.columns)
    var splittedP = columns.split("+")
    splittedP[0] = splittedP[0].substring(1)
    splittedP[splittedP.length-1] = splittedP[splittedP.length-1].substring(0,splittedP[splittedP.length-1].length-1)
    
    
    var values = JSON.stringify(req.params.values)
    var splittedV = values.split("+")
    splittedV[0] = splittedV[0].substring(1)
    splittedV[splittedV.length-1] = splittedV[splittedV.length-1].substring(0,splittedV[splittedV.length-1].length-1)

    if(!(splittedP.length == 3 && splittedP.length==splittedV.length))
        return false

    return isColumnInCondition(req,'username') && isColumnInCondition(req,'answer') && isColumnInCondition(req,'question')
}
module.exports.isAddQuestionAndAnswer= isAddQuestionAndAnswer

//This function checks if the syntax for addCategory
function isAddCategory(req,res)
{
    var columns = JSON.stringify(req.params.columns)
    var splittedP = columns.split("+")
    splittedP[0] = splittedP[0].substring(1)
    splittedP[splittedP.length-1] = splittedP[splittedP.length-1].substring(0,splittedP[splittedP.length-1].length-1)
    
    
    var values = JSON.stringify(req.params.values)
    var splittedV = values.split("+")
    splittedV[0] = splittedV[0].substring(1)
    splittedV[splittedV.length-1] = splittedV[splittedV.length-1].substring(0,splittedV[splittedV.length-1].length-1)

    if(!(splittedP.length == 1 && splittedP.length==splittedV.length))
        return false

    return isColumnInCondition(req,'name')
}
module.exports.isAddCategory = isAddCategory


//This function checks if the syntax for updateRank
function isUpdateRank(req,res)
{
    
    return checkTable(req,'pointOfInterest') && isColumnEqualToNumber(req,'rank') && isConditionEqualToString(req,'name')
}
module.exports.isUpdateRank = isUpdateRank

//This function checks if column='number'
function isColumnEqualToNumber(req,column)
{
    var squery = JSON.stringify(req.params.values)
    squery = squery.substring(1,squery.length-1)
    if(squery.length< column.length+1)
    if(!(column===squery.substring(0,column.length)))
        return false
    if(!(squery.charAt(column.length)==='='))
        return false
    return !isNaN(Number(squery.substring(column.length+1)))
}

function validateFinal(req){
    return true;
}

module.exports.validateFinal = validateFinal;

//This function checks if condition='String'
function isConditionEqualToString(req,column)
{
    var squery = JSON.stringify(req.params.condition)
    squery = squery.substring(1,squery.length-1)
    if(squery.length< column.length+1)
    if(!(column===squery.substring(0,column.length)))
        return false
    
    return !(squery.charAt(column.length)==='=')
    
}


//This function check the imput of the register
function isGoodregister(req,res){
    var flag = false
        var temp= JSON.stringify(req.params.columns)
        temp = temp.substring(1,temp.length-1).split("+")
        if(temp.includes("username")&&temp.includes("first_name")&&temp.includes("last_name")&&temp.includes("city")&&temp.includes("country")
        &&temp.includes("Email")&&temp.includes("password"))
        {
            flag=true
        }
        var temp1= JSON.stringify(req.params.values)
        temp1 = temp1.substring(1,temp1.length-1).split("+")
        console.log(temp1)
        // for(var i=0;i<temp1.length;i++){
        //     if(/\d/.test(temp1[i]))
        //     {
        //         flag=false
        //     }
        // }

        return flag
}

module.exports.isGoodregister = isGoodregister;

//this function will check if the syntax for addfavorites is correct
function isAddFavorites(req,res)
{
    var bool= false
    var point=JSON.stringify(req.params.values)
    var temp= point.split('=')
    temp[0] = temp[0].substring(1)
    temp[1] = temp[1].substring(0,temp[1].length-1)
    if(temp[0]==="point_of_interest"&&temp.length==2&&
    JSON.stringify(req.params.condition).includes("username")&&JSON.stringify(req.params.condition).includes("point_of_interest")){
        bool=true
    }
    return bool
} 

module.exports.isAddFavorites = isAddFavorites



