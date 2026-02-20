const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const userId = req.user?.userId;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Name, email, and message are required'
      });
    }

    // Here you would typically save to database
    // For now, we'll just log the contact message
    console.log('Contact message received:', {
      userId,
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    });

    // In a real application, you might want to:
    // 1. Save to database
    // 2. Send email notification
    // 3. Store in a support ticket system

    res.status(200).json({
      success: true,
      message: 'Contact message sent successfully'
    });

  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({
      error: 'Failed to send contact message'
    });
  }
};

module.exports = { submitContact };
