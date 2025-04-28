import User from "../assets/Icons/User.svg";
import OrderBox from "../assets/Icons/Box.svg";
import Book from "../assets/Icons/Book.svg";
import Note from "../assets/Icons/Note.svg";
import Info from "../assets/Icons/Info_Circle.svg";
import ContactUs from "../assets/Icons/Profile/contactus.svg";
import FAQIcon from "../assets/Icons/Profile/faq.svg";
import { RFValue } from "../utils/responsive";

export const Profile_Data = [
  {
    title: "",
    data: [
      {
        id: 1,
        name: "My Profile",
        screen: "Myprofile",
        icon: <User width={RFValue(20)} height={RFValue(20)} />,
        arrow: true,
      },
      {
        id: 2,
        name: "My Orders",
        screen: "Myorders",
        icon: <OrderBox width={RFValue(20)} height={RFValue(20)} />,
        arrow: true,
      },
      {
        id: 3,
        name: "My Addresses",
        screen: "Myaddress",
        icon: <Book width={RFValue(20)} height={RFValue(20)} />,
        arrow: true,
      },
    ],
  },
  {
    title: "Information",
    data: [
      {
        id: 4,
        name: "Terms & Policies",
        screen: "Terms",
        icon: <Note width={RFValue(20)} height={RFValue(20)} />,
        arrow: true,
      },
      {
        id: 6,
        name: "FAQs",
        screen: "Faqscreen",
        icon: <FAQIcon width={RFValue(20)} height={RFValue(20)} />,
        arrow: true,
      },
      {
        id: 7,
        name: "Contact Us",
        screen: "Contactus",
        icon: <ContactUs width={RFValue(20)} height={RFValue(20)} />,
        arrow: true,
      },
      {
        id: 8,
        name: "About",
        screen: "AboutUs",
        icon: <Info width={RFValue(20)} height={RFValue(20)} />,
        arrow: true,
      },
    ],
  },
];

export const PoliciesData = [
  {
    id: 1,
    title: "Terms of Use",
    screen: "Terms",
  },
  {
    id: 2,
    title: "Privacy Policy",
    screen: "Privacy",
  },
];
