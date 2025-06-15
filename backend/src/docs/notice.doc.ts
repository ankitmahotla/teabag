/**
 * @openapi
 * /api/notice:
 *   post:
 *     summary: Create a team notice
 *     description: |
 *       Allows the team leader to post a new notice to their team's notice board.
 *       Requires valid input and team leadership verification.
 *     tags:
 *       - Notice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamId
 *               - message
 *               - postedBy
 *             properties:
 *               teamId:
 *                 type: string
 *                 format: uuid
 *                 example: a1b2c3d4-e5f6-7890-1234-56789abcdef0
 *               message:
 *                 type: string
 *                 example: Don't forget to submit your task by Friday.
 *               postedBy:
 *                 type: string
 *                 format: uuid
 *                 example: e9f25759-e292-4e33-94d7-1a6cce4c1468
 *     responses:
 *       201:
 *         description: Notice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notice'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Only team leaders can post notices
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to create notice
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/notice/{teamId}:
 *   get:
 *     summary: Get all notices for a team
 *     description: Retrieves all notice board entries for a specific team.
 *     tags:
 *       - Notice
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the team
 *     responses:
 *       200:
 *         description: List of notices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notice'
 *       400:
 *         description: Team ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to fetch notices
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/notice/{id}:
 *   put:
 *     summary: Update a team notice
 *     description: |
 *       Allows the team leader to update an existing notice.
 *       Only the team leader who created the notice is authorized to update it.
 *     tags:
 *       - Notice
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the notice to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - postedBy
 *             properties:
 *               message:
 *                 type: string
 *                 example: Deadline moved to Saturday.
 *               postedBy:
 *                 type: string
 *                 format: uuid
 *                 example: e9f25759-e292-4e33-94d7-1a6cce4c1468
 *     responses:
 *       200:
 *         description: Notice updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notice'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Only team leaders can update notices
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Notice not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to update notice
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/notice/{id}:
 *   delete:
 *     summary: Delete a team notice
 *     description: |
 *       Allows the team leader to delete a notice.
 *     tags:
 *       - Notice
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the notice to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postedBy
 *             properties:
 *               postedBy:
 *                 type: string
 *                 format: uuid
 *                 example: e9f25759-e292-4e33-94d7-1a6cce4c1468
 *     responses:
 *       200:
 *         description: Notice deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notice deleted successfully
 *       400:
 *         description: Notice ID and postedBy are required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Only team leaders can delete notices
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Notice not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to delete notice
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Notice:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: abc12345-6789-def0-1234-56789abcdef0
 *         teamId:
 *           type: string
 *           format: uuid
 *           example: a1b2c3d4-e5f6-7890-1234-56789abcdef0
 *         message:
 *           type: string
 *           example: Don’t forget our standup at 10 AM!
 *         postedBy:
 *           type: string
 *           format: uuid
 *           example: e9f25759-e292-4e33-94d7-1a6cce4c1468
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-06-15T10:30:00Z
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: An error message
 */
