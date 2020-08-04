const { Model } = require(`${process.cwd()}/core/Model`)
const { mhsSchema } = require(`${process.cwd()}/app/models/mhs.model`)
const { CustomeMessage } = require(`${process.cwd()}/app/helpers/customeMessage`)
const { Jwt } = require(`${process.cwd()}/app/libs/jwt`)

class CreateMahasiswaController extends Model {
  constructor() {
    super()
    this.model = new Model(mhsSchema)
    this.jwt = new Jwt()
  }

  async controller(req, res) {
    const { model, jwt } = this
    const { nama, npm, bid, fak } = req.body
    const user = await model.findOne({ nama, npm, bid, fak })

    if (user) {
      return new CustomeMessage(res).error(409, {
        response: {
          status: 'error',
          code: res.statusCode,
          method: req.method,
          message: 'Oops..data already exists in database',
          data: user
        }
      })
    }

    const { _id } = await model.findOneAndCreate({ nama, npm, bid, fak })
    const token = jwt.createToken({ _id, nama }, { expiresIn: '1d', algorithm: 'HS384' })
    return new CustomeMessage(res).success(200, {
      response: {
        status: 'success',
        code: res.statusCode,
        method: req.method,
        message: 'Yeah..data successuly store in database',
        access_token: token
      }
    })
  }
}

module.exports = { CreateMahasiswaController }
