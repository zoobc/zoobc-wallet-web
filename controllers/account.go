package controllers

import (
	"github.com/astaxie/beego"
)

type AccountController struct {
	beego.Controller
}

// Examples:
//
//   req: POST /task/ {"Title": ""}
//   res: 400 empty title
//
//   req: POST /task/ {"Title": "Buy bread"}
//   res: 200
func (acc *AccountController) AddAccountForm() {
	acc.Data["Website"] = "spinechain.go"
	acc.Data["Email"] = "admin@spineshain.com"
	acc.TplName = "account/index.tpl"
}
