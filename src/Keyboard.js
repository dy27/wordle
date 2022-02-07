import React, { useState, useEffect, useRef } from 'react';
import { createTheme, ThemeProvider, Box, Button, Grid, Stack, Typography } from '@mui/material';

const letterToIndex = letter => letter.toLowerCase().charCodeAt() - 'a'.charCodeAt();

const theme = createTheme({
    palette: {
        blank: {
            // light: '#ffffff',
            main: '#8c8c8c',
            // dark: '#ffffff',
            // contrastText: '#ffffff'
        },
        grey: {
            main: '#303030',
        },
        yellow: {
            main: '#ffa500',
        },
        green: {
            main: '#008000',
        },
    }
})

const LetterState = {
    BLANK: 0,
    GREY: 1,
    YELLOW: 2,
    GREEN: 3,
  }

const keyButton = (props) => {
    return (
        <Grid item xs={8}>
            <ThemeProvider theme={theme}>
                <Button
                    variant='contained'
                    disableElevation
                    onClick={ () => props.onClick(props.value) }
                    color={ (() => {
                        if (props.state === LetterState.GREY) { return "grey" }
                        else if (props.state === LetterState.YELLOW) { return "yellow" }
                        else if (props.state === LetterState.GREEN) { return "green" }
                        else { return "blank" }
                    })() }
                    style={{
                        maxWidth: '30px',
                        maxHeight: '45px',
                        minWidth: '30px',
                        minHeight: '45px',
                    }}
                >
                    <Typography
                        style={{ fontFamily: 'DM Sans', color: '#e3e3e3', fontSize: 16 }}
                    >
                        {props.text}
                    </Typography>
                </Button>
            </ThemeProvider>
        </Grid>
    );
}

const Keyboard = (props) => {
    // const rows = [
    //     [['Q','Q'], ['W','W'], ['E','E'], ['R','R'], ['T','T'], ['Y','Y'], ['U','U'], ['I','I'], ['O','O'], ['P','P']],
    //     [['A','A'], ['S','S'], ['D','D'], ['F','F'], ['G','G'], ['Y','Y'], ['U','U'], ['I','I'], ['O','O'], ['P','P']],
    //     [['Q','Q'], ['W','W'], ['E','E'], ['R','R'], ['T','T'], ['Y','Y'], ['U','U'], ['I','I'], ['O','O'], ['P','P']],
    // ];

    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ];

    return (
        <Box
            style={{
                paddingTop: 30
            }}
        >
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
            >
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                >
                    {rows[0].map((letter) => keyButton({
                        onClick: props.onClick,
                        text: letter,
                        value: letter,
                        state: (letter.length == 1 && letter.match(/[a-zA-Z]/)) ? props.letterStates[letterToIndex(letter)] : null
                    }))}
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                >
                    {rows[1].map((letter) => keyButton({
                        onClick: props.onClick,
                        text: letter,
                        value: letter,
                        state: (letter.length == 1 && letter.match(/[a-zA-Z]/)) ? props.letterStates[letterToIndex(letter)] : null
                    }))}
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                >
                    {keyButton({
                        onClick: props.onClick,
                        text: 'ENT',
                        value: '\r',
                        state: null
                    })}
                    {rows[2].map((letter) => keyButton({
                        onClick: props.onClick,
                        text: letter,
                        value: letter,
                        state: (letter.length == 1 && letter.match(/[a-zA-Z]/)) ? props.letterStates[letterToIndex(letter)] : null
                    }))}
                    {keyButton({
                        onClick: props.onClick,
                        text: 'DEL',
                        value: '\b',
                        state: null
                    })}
                </Stack>
            </Stack>
        </Box>
    );
}

export default Keyboard