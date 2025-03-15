const googleMap = {
  title: "Goodwood, Cape Town, 7460",
  src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52980.82232536073!2d18.498110158556987!3d-33.90764174186438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc5bada98e54b5%3A0x1012b82d9ba600e3!2sGoodwood%2C%20Cape%20Town%2C%207460!5e0!3m2!1sen!2sza!4v1739165123371!5m2!1sen!2sza",
};

const supportedRoles: [string, ...string[]] = ["ADMIN", "USER", "VENDOR"];

const supportedCities: [string, ...string[]] = [
  "Cape Town",
  "Durban",
  "Johannesburg",
  "Pretoria",
  "Port Elizabeth",
];

export { supportedRoles, supportedCities, googleMap };
