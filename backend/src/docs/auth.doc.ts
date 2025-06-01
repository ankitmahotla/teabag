/**
 * @openapi
 * /api/auth/sign-in:
 *   post:
 *     summary: Sign in with Google OAuth
 *     description: |
 *       Exchanges a Google authorization code for tokens, verifies the user, creates or updates the user in the database,
 *       and returns access and refresh tokens in HTTP-only cookies.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "4/0AX4XfWh...OAuthCode"
 *     responses:
 *       200:
 *         description: Sign-in successful, tokens set in cookies
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only access and refresh tokens
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Missing or invalid authorization code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing authorization code
 *       500:
 *         description: Server error during sign-in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @openapi
 * /api/auth/sign-out:
 *   post:
 *     summary: Sign out the user
 *     description: |
 *       Clears the access and refresh tokens from HTTP-only cookies and signs out the user.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Sign-out successful
 *         headers:
 *           Set-Cookie:
 *             description: Cookies cleared
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Refresh token is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing refresh token
 *       500:
 *         description: Server error during sign-out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @openapi
 * /api/auth/refresh-tokens:
 *   post:
 *     summary: Refresh authentication tokens
 *     description: |
 *       Verifies the refresh token (from HTTP-only cookies) and issues new access and refresh tokens in cookies.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             description: New access and refresh tokens
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Refresh token is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing refresh token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error during token refresh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
