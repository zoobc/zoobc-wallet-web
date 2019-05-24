package routers

import (
	"github.com/BlockchainZoo/spinechain-web-wallet-prototype/controllers"
	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/dashboard", &controllers.MainController{}, "get:Dashboard")
	beego.Router("/sendmoney", &controllers.AccountController{}, "get:SendMoneyForm")
	beego.Router("/sendmessage", &controllers.AccountController{}, "get:SendMessageForm")
	beego.Router("/transferhistory", &controllers.AccountController{}, "get:TransferHistoryTable")
	beego.Router("/blocks", &controllers.SettingController{}, "get:BlockList")
	beego.Router("/peers", &controllers.SettingController{}, "get:PeerList")
	beego.Router("/generators", &controllers.SettingController{}, "get:GeneratorList")
}
