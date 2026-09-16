package lox

class Scanner(private val source: String) {

    private val tokens = mutableListOf<Token>()

    private var start = 0
    private var current = 0
    private var line = 1

    fun scanTokens(): List<Token> {
        while (!isAtEnd()) {
            start = current
            scanToken()
        }

        tokens.add(Token(TokenType.EOF, "", null, line))
        return tokens
    }

    private fun scanToken() {
        val c = advance()

        when (c) {
            '(' -> addToken(TokenType.LEFT_PAREN)
            ')' -> addToken(TokenType.RIGHT_PAREN)
            '{' -> addToken(TokenType.LEFT_BRACE)
            '}' -> addToken(TokenType.RIGHT_BRACE)

            ',' -> addToken(TokenType.COMMA)
            '.' -> addToken(TokenType.DOT)
            '-' -> addToken(TokenType.MINUS)
            '+' -> addToken(TokenType.PLUS)
            ';' -> addToken(TokenType.SEMICOLON)
            '*' -> addToken(TokenType.STAR)

            ' ', '\r', '\t' -> {
                // Ignore whitespace.
            }

            '\n' -> line++

            '/' -> {
                if (match('/')) {
                    while (peek() != '\n' && !isAtEnd()) {
                        advance()
                    }
                } else {
                    addToken(TokenType.SLASH)
                }
            }

            '!' -> addToken(
                if (match('=')) TokenType.BANG_EQUAL
                else TokenType.BANG
            )

            '=' -> addToken(
                if (match('=')) TokenType.EQUAL_EQUAL
                else TokenType.EQUAL
            )

            '<' -> addToken(
                if (match('=')) TokenType.LESS_EQUAL
                else TokenType.LESS
            )

            '>' -> addToken(
                if (match('=')) TokenType.GREATER_EQUAL
                else TokenType.GREATER
            )

            '"' -> string()

            else -> {
                when {
                    c.isDigit() -> number()
                    c.isLetter() || c == '_' -> identifier()
                    else -> {
                        println("[line $line] Unexpected character: $c")
                    }
                }
            }
        }
    }

    private fun advance(): Char {
        return source[current++]
    }

    private fun addToken(type: TokenType) {
        addToken(type, null)
    }

    private fun addToken(type: TokenType, literal: Any?) {
        val text = source.substring(start, current)
        tokens.add(Token(type, text, literal, line))
    }

    private fun match(expected: Char): Boolean {
        if (isAtEnd()) return false
        if (source[current] != expected) return false

        current++
        return true
    }

    private fun peek(): Char {
        if (isAtEnd()) return '\u0000'
        return source[current]
    }

    private fun isAtEnd(): Boolean {
        return current >= source.length
    }

    private fun string() {
        while (peek() != '"' && !isAtEnd()) {
            if (peek() == '\n') {
                line++
            }

            advance()
        }

        if (isAtEnd()) {
            println("[line $line] Unterminated string.")
            return
        }

        // Consume the closing quote.
        advance()

        // Remove the surrounding quotes.
        val value = source.substring(start + 1, current - 1)

        addToken(TokenType.STRING, value)
    }

    private fun number() {
        while (peek().isDigit()) {
            advance()
        }

        // Look for a decimal part.
        if (peek() == '.' && peekNext().isDigit()) {
            advance()

            while (peek().isDigit()) {
                advance()
            }
        }

        val value = source.substring(start, current).toDouble()
        addToken(TokenType.NUMBER, value)
    }

    private fun peekNext(): Char {
        if (current + 1 >= source.length) return '\u0000'
        return source[current + 1]
    }

    private fun identifier() {
        while (peek().isLetterOrDigit() || peek() == '_') {
            advance()
        }

        val text = source.substring(start, current)

        val type = keywords[text] ?: TokenType.IDENTIFIER

        addToken(type)
    }

    companion object {
        private val keywords = mapOf(
            "and" to TokenType.AND,
            "class" to TokenType.CLASS,
            "else" to TokenType.ELSE,
            "false" to TokenType.FALSE,
            "for" to TokenType.FOR,
            "fun" to TokenType.FUN,
            "if" to TokenType.IF,
            "nil" to TokenType.NIL,
            "or" to TokenType.OR,
            "print" to TokenType.PRINT,
            "return" to TokenType.RETURN,
            "super" to TokenType.SUPER,
            "this" to TokenType.THIS,
            "true" to TokenType.TRUE,
            "var" to TokenType.VAR,
            "while" to TokenType.WHILE
        )
    }
}