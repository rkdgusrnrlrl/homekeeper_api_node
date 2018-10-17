/**
 * Created by rkdgusrnrlrl on 16. 5. 22.
 */

var express = require('express')
var router = express.Router()

//root 하는 부분
router.get('/', function (req, res)  {
    res.send("hello")
})

//select 하는 부분
router.get('/api/homekeepers', function (req, res)  {
    responseJson(res, mock_data)
})

//insert 하는 부분
router.post('/api/homekeepers', function (req, res)  {
    var homekeeper = getObjFromParamForExpress(req)
    insertHomekeeper(homekeeper)
    responseJson(res, mock_data)
})

//delete 하는 부분
router.delete('/api/homekeepers/homekeeper', function (req, res)  {
    console.log(`body : ${JSON.stringify(req.body)}`)
    var homekeeper = getObjFromParamForExpress(req)
    var id = homekeeper.id
    deleteHomeKeeper(id)
    responseJson(res, mock_data)
})


//modify 하는 부분
router.post('/api/homekeepers/homekeeper', function (req, res)  {
    var homekeeper = getObjFromParamForExpress(req)
    var id = homekeeper.id
    updateHomekeeper(id, homekeeper)
    responseJson(res, mock_data)
})


module.exports = router

//DB 연동부분

/**
 * 가계부 내용을 등록 함
 * @param homekeeper
 */
function insertHomekeeper(homekeeper) {
    mock_data.homekeepers.push(homekeeper)
}

/**
 * 해당 id 의 가계부를 업데이트 함
 * @param id
 * @param homekeeper
 */
function updateHomekeeper(id, homekeeper) {
    mock_data.homekeepers = mock_data.homekeepers.map((val, ind, arr)=> {
        if (val.id == id)  val = homekeeper
        return val
    })
}

/**
 * 가계부 내역 리스트를 보여줌
 * @param jsonData
 */
function findHomeKeeperList(jsonData) {
    return JSON.stringify(jsonData)
}

/**
 * 가계부내역을 삭제함
 * @param id
 */
function deleteHomeKeeper(id) {
    mock_data.homekeepers = mock_data.homekeepers.filter((val, ind, arr)=> {
            return val.id != id
    })
}

//request response 핸들링 하는 함수

/**
 * 파라미터의 값을 추출해 json 으로 만들어줌
 * @param data
 * @returns {{}}
 */
function getObjFromParam(data) {

    var keys = ["id" , "payDate", "inOut", "content", "money"]

    var obj = {}
    var temArr = (data+'').split('&')
    temArr.forEach((val, index, arr) => {
        var keyAndVal = val.split('=')
        var key = fromSnakeToCamel(keyAndVal[0])
        if(keys.indexOf(key) != -1){
            if(key == 'content'){
                obj[key] = decodeURIComponent(keyAndVal[1].replace(/[+]/g, ' '))
            } else {
                obj[key] = keyAndVal[1]
            }

        }
    })
    return obj
}

function fromSnakeToCamel (string){
    return string.replace(/(\_[a-z])/g, ($1) =>  $1.toUpperCase().replace('_',''))
}

/**
 * 한글로 인코딩된 value 를 디코딩하는 함수
 * @param expressReq
 * @param key
 * @returns {string}
 */
function decodeValue(val) {
    return decodeURIComponent(val.replace(/[+]/g, ' '))
}

/**
 * Express.js request 에서 파라미터값 추출하는 함수
 * @param expressReq
 * @param key
 * @returns {*}
 */
function getParam(expressReq, key) {
    var value = expressReq.param(key)
    if (value) {
        if (key == 'content') {
            return decodeValue(value)
        } else {
            return value
        }
    } else {
        return ""
    }
}

function camelToSnake(val) {
    return val.replace(/([A-Z])/g, ($1) => "_" + $1.toLowerCase())
}
/**
 * Express.js 에서 파라미터 값 추출해 object로 반환하는 함수
 * @param expressReq
 * @returns {{}}
 */
function getObjFromParamForExpress(expressReq) {

    var keys = ["id" , "payDate", "inOut", "content", "money"]
    var obj = {}
    keys.forEach((val, index, arr) => {
        var key = camelToSnake(val)
        obj[val] = getParam(expressReq, key)
    })
    return obj
}

/**
 * response 에 json 데이터를 담아 보내줌
 * @param response
 * @param jsonData
 */
function responseJson(response, jsonData) {
    response.setHeader("Content-Type", "application/json")

    var homekeeperList = findHomeKeeperList(jsonData)
    response.write(homekeeperList)
    response.end()
}






var mock_data = { homekeepers : [
    {
        id : 1,
        payDate : "2016-02-11",
        inOut : "in",
        content : "월급",
        money : 1700000
    },
    {
        id : 2,
        payDate : "2016-02-11",
        inOut : "in",
        content : "책",
        money : 15000
    },
    {
        id : 3,
        payDate : "2016-02-11",
        inOut : "in",
        content : "피자 소주 (아빠 생일)",
        money : 20000
    },
    {
        id : 4,
        payDate : "2016-02-16",
        inOut : "out",
        content : "가방",
        money : 20000
    },
]}