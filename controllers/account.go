package controllers

import (
	"github.com/astaxie/beego"
)

//AccountController conrtoller related account
type AccountController struct {
	beego.Controller
}

//SendMoneyForm send money form
func (acc *AccountController) SendMoneyForm() {
	acc.Layout = "admin.html"
	acc.Data["title"] = "Send Money"
	acc.TplName = "account/sendmoney.tpl"
}

//SendMessageForm send message form
func (acc *AccountController) SendMessageForm() {
	acc.Layout = "admin.html"
	acc.Data["title"] = "Send Message"
	acc.TplName = "account/sendmessage.tpl"
}

//TransferHistoryTable transfer history
func (acc *AccountController) TransferHistoryTable() {
	acc.Layout = "admin.html"
	acc.Data["title"] = "Transfer History"
	acc.TplName = "account/transferhistory.tpl"
}
