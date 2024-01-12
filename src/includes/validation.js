//Notre plugin

//renommage pour éviter conflit avec Vue natif
//'ErrorMessage' => component pour gérer l'affichage des messages d'erreurs suite à la validation d'un formulaire
import { Form as VeeForm, Field as VeeField, defineRule, ErrorMessage, configure } from "vee-validate";
//min et max : limite nombre ; alpha_spaces : caractères de l'alphabet
import {
    required, min, max, alpha_spaces as alphaSpaces, email,
    min_value as minVal, max_value as maxVal, not_one_of as excluded,
    confirmed,
} from "@vee-validate/rules";

export default {
    /*
        APP : référence vers l'application.
        Options: des propriétés supplémentaires (permet de configurer le plugin)
     */
    install(app, options) {
        app.component("VeeForm", VeeForm);
        app.component("VeeField", VeeField);
        app.component("ErrorMessage", ErrorMessage);

        //On peut avoir plusieurs régles identiques mais concernant des fields différents
        //passwords_mismatch et country_excluded par exemple
        defineRule("required", required);
        defineRule("tos", required);
        defineRule("min", min);
        defineRule("max", max);
        defineRule("alpha_spaces", alphaSpaces);
        defineRule("email", email);
        defineRule("min_value", minVal);
        defineRule("max_value", maxVal);
        defineRule("passwords_mismatch", confirmed);
        defineRule("excluded", excluded);
        defineRule("country_excluded", excluded);

        configure({
            generateMessage: (ctx) => {
                const messages = {
                    required: `The field ${ ctx.field } is required.`,
                    min: `The field ${ ctx.field } is too short.`,
                    max: `The field ${ ctx.field } is too long.`,
                    alpha_spaces: `The field ${ ctx.field } may only contain alphabetical characters and spaces.`,
                    email: `The field ${ ctx.field } must be a valid email.`,
                    min_value: `The field ${ ctx.field } is too low.`,
                    max_value: `The field ${ ctx.field } is too high.`,
                    excluded: `You're not allowed to use this value for the field ${ ctx.field }.`,
                    country_excluded: `Due to restrictions, we do not accept users from this location.`,
                    passwords_mismatch: `The passwords don't match.`,
                    tos: `You must accept the Terms of Service.`,
                };
                //renvoi le message custom ou un autre par défaut
                const message = messages[ctx.rule.name] ? messages[ctx.rule.name] : `The field ${ ctx.field } is invalid.`
                return message;
            }
        });
    },
};