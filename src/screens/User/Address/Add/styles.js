import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "../../../../constants/Theme";
import { RFValue } from "../../../../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollcontainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    color: COLORS.BLACK,
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(16),
  },
  subcontainer: {
    gap: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  text: {
    color: COLORS.BLACK,
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(14),
  },
  btncontainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  snackcontainer: {
    padding: 10,
    position: "absolute",
    bottom: 70,
    width: "100%",
    alignSelf: "center",
  },
});
