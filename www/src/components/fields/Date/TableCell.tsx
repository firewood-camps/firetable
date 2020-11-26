import React from "react";
import clsx from "clsx";
import { ICustomCellProps } from "../types";
import { useDebouncedCallback } from "use-debounce";

import { makeStyles, createStyles } from "@material-ui/core";

import { DateIcon } from "constants/fields";
import { DATE_FORMAT } from "constants/dates";
import { transformValue, sanitizeValue } from "./utils";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  DatePickerProps,
} from "@material-ui/pickers";

import { useFiretableContext } from "contexts/FiretableContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
    },
    inputBase: { height: "100%" },

    inputAdornment: {
      height: "100%",
      marginLeft: theme.spacing(1) + 1,
      marginRight: theme.spacing(0.25),
    },

    input: {
      ...theme.typography.body2,
      fontSize: "0.75rem",
      color: theme.palette.text.secondary,
      height: "100%",
      padding: theme.spacing(1.5, 0),
    },

    dateTabIcon: {
      color: theme.palette.primary.contrastText,
    },
  })
);

export default function Date_({
  rowIdx,
  column,
  value,
  onSubmit,
}: ICustomCellProps) {
  const classes = useStyles();
  const { dataGridRef } = useFiretableContext();

  const transformedValue = transformValue(value);

  const [handleDateChange] = useDebouncedCallback<DatePickerProps["onChange"]>(
    (date) => {
      const sanitized = sanitizeValue(date);
      if (sanitized === undefined) return;

      onSubmit(sanitized);
      if (dataGridRef?.current?.selectCell)
        dataGridRef.current.selectCell({ rowIdx, idx: column.idx });
    },
    500
  );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        value={transformedValue}
        onChange={handleDateChange}
        onClick={(e) => e.stopPropagation()}
        format={DATE_FORMAT}
        fullWidth
        clearable
        keyboardIcon={<DateIcon />}
        className={clsx("cell-collapse-padding", classes.root)}
        inputVariant="standard"
        InputProps={{
          disableUnderline: true,
          classes: { root: classes.inputBase, input: classes.input },
        }}
        InputAdornmentProps={{
          position: "start",
          classes: { root: classes.inputAdornment },
        }}
        KeyboardButtonProps={{
          size: "small",
          classes: { root: "row-hover-iconButton" },
        }}
        DialogProps={{ onClick: (e) => e.stopPropagation() }}
        disabled={column.editable === false}
      />
    </MuiPickersUtilsProvider>
  );
}