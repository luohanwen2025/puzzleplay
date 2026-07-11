const C3 = globalThis.C3;
C3.Plugins.Globals.Exps = {
    GetVariablesAsJSON()
    {
        let ret = JSON.stringify(this.instVars);
        console.log("Exp Return: " + ret);
        return ret;
    }
};