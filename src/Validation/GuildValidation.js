export const validateGuildData = (formData)=>{
    const errros ={};
    if(!formData.name){
        errros.name="Name is required";
    }else if(formData.name.length<10 || formData.name.length>30){
        errros.name="Name must be between 10 and 30 characters"

    }

    if(!formData.description){
        errros.description="Description is required";
    }else if(formData.description.length<10 || formData.description.length>150){
        errros.description="Description must be between 10 and 150 characters";
    }
    if (formData.members === null || formData.members === undefined) {
        errros.members = "Members Level is required";
    } else if (!Number.isInteger(formData.members) || formData.members < 0 || formData.members > 9999999999) {
        errros.members = "Members  must be a positive integer with up to 10 digits";
    }


    return errros;
}

// name: '',
//     description: '',
//     members: ''