var app = Application.currentApplication()
app.includeStandardAdditions = true
 
var document = app.chooseFile({
    withPrompt: "Please select a document to process:",
    ofType: ["jpg","png"],
    multipleSelectionsAllowed: true
})
document