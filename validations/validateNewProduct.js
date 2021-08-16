export default function validateNewProduct(values) {
    const errors = {};

    if(!values.name) {
        errors.name = "The name is required";
    }

    if(!values.business) {
        errors.business = "The business is required";
    }

    if(!values.url) {
        errors.url = "The URL is required";
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
        errors.url = "The URL is invalid";
    }

    if(!values.description) {
        errors.description = "The description is required";
    }

    return errors;
}