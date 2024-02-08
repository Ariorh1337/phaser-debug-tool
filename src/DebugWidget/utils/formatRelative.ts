export default function formatRelativeCenter(relative: -1 | 0 | 1, n: number) {
    const format = {
        "-1": (n: number) => n * 0,
        "0": (n: number) => n * 0.5,
        "1": (n: number) => n * 1,
    };

    return format[relative](n);
}