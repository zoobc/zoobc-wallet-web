package controllers

import (
	"github.com/astaxie/beego"
)

type AccountController struct {
	beego.Controller
}

func (acc *AccountController) AddAccountForm() {
	acc.Data["Website"] = "spinechain.go"
	acc.Data["Email"] = "admin@spineshain.com"
	acc.TplName = "account/index.tpl"
}

func (acc *AccountController) SendMoneyForm() {
	acc.Data["Website"] = "spinechain.go"
	acc.Data["Email"] = "admin@spineshain.com"
	acc.TplName = "account/sendmoney.tpl"
}
