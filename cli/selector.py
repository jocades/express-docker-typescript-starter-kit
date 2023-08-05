import curses


def draw_menu(stdscr, options):
    stdscr.clear()
    curses.curs_set(0)
    stdscr.addstr(0, 0, "Select HTTP methods:")
    stdscr.addstr(2, 0, "Use arrow keys to cycle through options.")
    stdscr.addstr(3, 0, "Press 'Space' to select/unselect an option.")
    stdscr.addstr(4, 0, "Press 'a' to select all options.")
    stdscr.addstr(5, 0, "Press 'Enter' to confirm.")

    selected = [False] * len(options)
    current_option = 0

    while True:
        for idx, option in enumerate(options):
            x = 7 + idx
            if idx == current_option:
                # Highlight the current option with a blue circle
                stdscr.addstr(x, 0, "\u25cf " if selected[idx] else "\u25cb ", curses.color_pair(1))
                stdscr.addstr(option, curses.color_pair(1))
            else:
                stdscr.addstr(x, 0, "\u25cf " if selected[idx] else "\u25cb ")
                stdscr.addstr(option)

        stdscr.refresh()

        key = stdscr.getch()

        if key == curses.KEY_UP:
            current_option = (current_option - 1) % len(options)
        elif key == curses.KEY_DOWN:
            current_option = (current_option + 1) % len(options)
        elif key == ord(' '):
            # Toggle selection for the current option
            selected[current_option] = not selected[current_option]
        elif key == ord('a'):
            # Select all options
            selected = [True] * len(options)
        elif key == 10:  # Enter key
            break

    return [options[i] for i in range(len(options)) if selected[i]]


def get_selected_methods():
    return curses.wrapper(draw_menu, ["GET", "POST", "PUT", "DELETE"])


def main(stdscr):
    # Setup the colors (if supported)
    curses.start_color()
    curses.init_pair(1, curses.COLOR_BLUE, curses.COLOR_BLACK)

    options = ["GET", "POST", "PUT", "DELETE"]

    selected_methods = draw_menu(stdscr, options)

    stdscr.clear()
    stdscr.addstr(0, 0, "Selected HTTP methods:")
    stdscr.addstr(2, 0, ", ".join(selected_methods))
    stdscr.addstr(4, 0, "Press any key to exit.")
    stdscr.getch()


# if __name__ == "__main__":
#     curses.wrapper(main)
