const C3 = globalThis.C3;

C3.Plugins.Globals.Acts = {
    LoadVariables(json)
    {
        let newVars = JSON.parse(json);

        console.log(newVars.length);
        console.log(this.instVars.length);
        this._loadJsonData(newVars);
    },

    ResetVariables()
    {
        for(const [key, value] of Object.entries(this.defaultVarsValues)) {
            this.instVars[key] = value;
        }
    }
};