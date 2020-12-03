import { grey, blue, orange, purple } from "@material-ui/core/colors"

export default {
  container: {
    fontSize: 11,
    fontWeight: "bold",
    color: grey[700],
    "& .icon": {
      marginTop: 4,
      width: 10,
      height: 10,
      color:'green',

    },
    "& .icon2": {
      opacity: 0.5,
      width: 10,
      color:'green',
      height: 10,
      transition: "200ms opacity",
      "&:hover": {
        cursor: "pointer",
        opacity: 1,
      },
    },
  },
  row: {
    padding: 4,
    cursor: "pointer",
    "&.header:hover": {
      // backgroundColor: blue[50],
    },
    "&.highlighted": {
      backgroundColor: "#5999c9",
    },
    "&:hover": {
      // backgroundColor: blue[50],
      color: grey[800],
    },
  },
  chip: {
    display: "flex",
    flexDirection: "row",
    padding: 2,
    borderRadius: 2,
    paddingLeft: 4,
    paddingRight: 4,
    alignItems: "center",
    "& .color": {
      borderRadius: 5,
      width: 10,
      height: 10,
      marginRight: 4,
    },
    "& .text": {},
  },
}
