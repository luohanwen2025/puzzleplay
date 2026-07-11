const C3 = globalThis.C3;

C3.Plugins.Globals.Instance = class GlobalsInstance extends globalThis.ISDKInstanceBase
{
    constructor()
    {
        super();

        this.defaultVarsValues = structuredClone(this.instVars);
        //this.instance_vars = structuredClone(this.instVars);
    }

    _release()
    {
        super._release();
    }

    _saveToJson()
    {

        return {
            "v": JSON.stringify(this.instVars)
        };
    }

    _loadFromJson(o)
    {
        let data = JSON.parse(o["v"]);
        this._loadJsonData(data);
    }

    _loadJsonData(data) {
        if (Array.isArray(data)) {
            console.log("Source is ARRAY");
            let keys = Object.keys(this.instVars);
            for (let i = 0; i < keys.length; i++) {
                if (i >= data.length) break;
                let key = keys[i];
                console.log(`Key ${i}: ${key}:`, data[i]);
                this.instVars[key] = data[i];
            }
        } else {
            console.log("Source is OBJECT");
            for(const [key, val] of Object.entries(data)) {
                this.instVars[key] = val;
            }
        }
    }

    _getDebuggerProperties()
    {
        return [
        {
            title: "Globals",
            properties: [
                //{name: ".current-animation",	value: this._currentAnimation.GetName(),	onedit: v => this.CallAction(Acts.SetAnim, v, 0) },
            ]
        }];
    }
};