const renderTemplate = (template, prospect) => {

    let subject = template.subject || "";

    let message = template.message || "";

    const variables = {

        "{{companyName}}":
            prospect.companyName || "",

        "{{contactName}}":
            prospect.contactName || "",

        "{{jobTitle}}":
            prospect.jobTitle || "",

        "{{email}}":
            prospect.email || "",

        "{{phone}}":
            prospect.phone || "",

        "{{website}}":
            prospect.website || "",

        "{{country}}":
            prospect.location?.country || "",

        "{{city}}":
            prospect.location?.city || "",

        "{{currentSoftware}}":
            prospect.currentSoftware || ""

    };

    Object.keys(variables).forEach((key) => {

        const value = variables[key];

        subject = subject.replaceAll(
            key,
            value
        );

        message = message.replaceAll(
            key,
            value
        );

    });

    return {

        subject,

        message

    };

};

module.exports = {

    renderTemplate

};