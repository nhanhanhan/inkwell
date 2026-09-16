import lox.Scanner

fun main() {
    val source = """
        var x = 10;
        print x + 5;
    """.trimIndent()

    val scanner = Scanner(source)
    val tokens = scanner.scanTokens()

    for (token in tokens) {
        println(token)
    }
}