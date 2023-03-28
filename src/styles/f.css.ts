import { style } from "@vanilla-extract/css";

export const noVerticalMargin = style({
  marginTop: 0,
  marginBottom: 0,
});

export const flexColumn = style({
  display: "flex",
  flexDirection: "column",
});

export const flexGap = style({
  gap: 16,
});

export const flexColumnWithGap = style([flexColumn, flexGap]);

export const fontMedium = style({
  fontWeight: 500,
  fontSize: 18,
});
