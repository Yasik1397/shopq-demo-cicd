import * as Yup from "yup";
import { PhoneNumberUtil } from "google-libphonenumber";
import { countryCodes } from "react-native-country-codes-picker";
const phoneUtil = PhoneNumberUtil.getInstance();
export const PhoneSchema = Yup.object().shape({
  mobileNumber: Yup.string()
    .required("Mobile number is required.")
    .test(
      "valid-phone-number",
      "Enter a valid mobile number.",
      function (value) {
        const { path, parent, createError } = this;
        if (!value) {
          return createError({ path, message: "Mobile number is required." });
        }
        try {
          const countryCode = parent.countryCode.replace("+", "");
          const country_code = countryCodes.find(
            (val) => val.dial_code === `+${countryCode}`
          ).code;
          const phoneNumber = phoneUtil.parseAndKeepRawInput(
            value,
            country_code
          );
          if (!phoneUtil.isValidNumberForRegion(phoneNumber, country_code)) {
            return createError({
              path,
              message: "Enter a valid mobile number.",
            });
          }
          return true;
        } catch (error) {
          return createError({ path, message: "Enter a valid mobile number." });
        }
      }
    ),
  countryCode: Yup.string().required("Country code is required."),
});
