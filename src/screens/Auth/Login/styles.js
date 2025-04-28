import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "../../../constants/Theme";
import { RFValue } from "../../../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headertext: {
    fontFamily: FONTS.MEDIUM,
    color: COLORS.GREY,
    fontSize: RFValue(14),
  },
  titletxt: {
    fontFamily: FONTS.BOLD,
    color: COLORS.BLACK,
    fontSize: RFValue(22),
  },
  contenttxt: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.GREY,
    fontSize: RFValue(14),
  },
  snackcontainer: {
    padding: 10,
    position: "absolute",
    bottom: 10,
    width: "100%",
    alignSelf: "center",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  heading: {
    fontSize: RFValue(20),
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: RFValue(12),
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: RFValue(14),
  },
});
