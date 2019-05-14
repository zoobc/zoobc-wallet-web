package controllers

import (
	"github.com/astaxie/beego"
)

//AccountController ...
type AccountController struct {
	beego.Controller
}

//AddAccountForm ...
func (acc *AccountController) AddAccountForm() {
	acc.Data["Website"] = "spinechain.go"
	acc.Data["Email"] = "admin@spineshain.com"
	acc.TplName = "account/index.tpl"
}

//SendMoneyForm ...
func (acc *AccountController) SendMoneyForm() {
	acc.Data["Website"] = "spinechain.go"
	acc.Data["Email"] = "admin@spineshain.com"
	acc.TplName = "account/sendmoney.tpl"
}

//SendMessageForm ...
func (acc *AccountController) SendMessageForm() {
	acc.Data["Website"] = "spinechain.go"
	acc.Data["Email"] = "admin@spineshain.com"
	acc.TplName = "account/sendmessage.tpl"
}

//TransferHistoryTable ...
func (acc *AccountController) TransferHistoryTable() {
	acc.Data["Website"] = "spinechain.go"
	acc.Data["Email"] = "admin@spineshain.com"
	acc.TplName = "account/transferhistory.tpl"
}
