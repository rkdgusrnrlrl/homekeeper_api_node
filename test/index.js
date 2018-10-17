const expect = require('chai').expect
const rq = require('request-promise-native')

describe('API 서버 테스트', () => {
    const BASE_URL = 'http://localhost:3000/';

    it('서버 `/` 접속 테스트', async () => {
        const hello = await rq({
            url : BASE_URL,
            method : 'GET',
            json : true,
            resolveWithFullResponse : true
        })
        expect(hello.statusCode).to.equal(200)
    }).timeout(200)
})