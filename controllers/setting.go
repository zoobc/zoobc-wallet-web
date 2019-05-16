package controllers

import (
	"github.com/astaxie/beego"
)

//SettingController ...
type SettingController struct {
	beego.Controller
}

//GeneratorList list of block generator
func (acc *SettingController) GeneratorList() {
	acc.Data["title"] = "Generator List"
	acc.Layout = "template/admin.html"
	acc.TplName = "setting/generators.tpl"
}

//PeerList list of peers
func (acc *SettingController) PeerList() {
	acc.Data["title"] = "Peer List"
	acc.Layout = "template/admin.html"
	acc.TplName = "setting/peers.tpl"
}

//BlockList list of Block
func (acc *SettingController) BlockList() {
	acc.Data["title"] = "Block List"
	acc.Layout = "template/admin.html"
	acc.TplName = "setting/blocks.tpl"
}
