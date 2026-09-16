package lox

import kotlin.test.Test
import kotlin.test.assertEquals

class ScannerTest {

    @Test
    fun `scans single character tokens`() {
        val scanner = Scanner("(){} ,.-+;*")
        val tokens = scanner.scanTokens()

        val types = tokens.map { it.type }

        assertEquals(
            listOf(
                TokenType.LEFT_PAREN,
                TokenType.RIGHT_PAREN,
                TokenType.LEFT_BRACE,
                TokenType.RIGHT_BRACE,
                TokenType.COMMA,
                TokenType.DOT,
                TokenType.MINUS,
                TokenType.PLUS,
                TokenType.SEMICOLON,
                TokenType.STAR,
                TokenType.EOF
            ),
            types
        )
    }

    @Test
    fun `scans comparison and equality operators`() {
        val scanner = Scanner("! != = == > >= < <=")
        val tokens = scanner.scanTokens()

        val types = tokens.map { it.type }

        assertEquals(
            listOf(
                TokenType.BANG,
                TokenType.BANG_EQUAL,
                TokenType.EQUAL,
                TokenType.EQUAL_EQUAL,
                TokenType.GREATER,
                TokenType.GREATER_EQUAL,
                TokenType.LESS,
                TokenType.LESS_EQUAL,
                TokenType.EOF
            ),
            types
        )
    }

    @Test
    fun `scans numbers`() {
        val scanner = Scanner("123 45.67")
        val tokens = scanner.scanTokens()

        assertEquals(TokenType.NUMBER, tokens[0].type)
        assertEquals(123.0, tokens[0].literal)

        assertEquals(TokenType.NUMBER, tokens[1].type)
        assertEquals(45.67, tokens[1].literal)
    }

    @Test
    fun `scans strings`() {
        val scanner = Scanner("\"hello world\"")
        val tokens = scanner.scanTokens()

        assertEquals(TokenType.STRING, tokens[0].type)
        assertEquals("hello world", tokens[0].literal)
    }

    @Test
    fun `scans keywords and identifiers`() {
        val scanner = Scanner("var x = true; print x;")
        val tokens = scanner.scanTokens()

        assertEquals(TokenType.VAR, tokens[0].type)
        assertEquals(TokenType.IDENTIFIER, tokens[1].type)
        assertEquals("x", tokens[1].lexeme)

        assertEquals(TokenType.EQUAL, tokens[2].type)
        assertEquals(TokenType.TRUE, tokens[3].type)
        assertEquals(TokenType.SEMICOLON, tokens[4].type)

        assertEquals(TokenType.PRINT, tokens[5].type)
        assertEquals(TokenType.IDENTIFIER, tokens[6].type)
        assertEquals(TokenType.SEMICOLON, tokens[7].type)
        assertEquals(TokenType.EOF, tokens[8].type)
    }

    @Test
    fun `ignores comments`() {
        val scanner = Scanner("// this is a comment\n123")
        val tokens = scanner.scanTokens()

        assertEquals(TokenType.NUMBER, tokens[0].type)
        assertEquals(123.0, tokens[0].literal)
        assertEquals(TokenType.EOF, tokens[1].type)
    }

    @Test
    fun `tracks line numbers`() {
        val scanner = Scanner("123\n456")
        val tokens = scanner.scanTokens()

        assertEquals(1, tokens[0].line)
        assertEquals(2, tokens[1].line)
    }
}