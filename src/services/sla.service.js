const { SLA_TIMES } = require('../config/environment');

class SLAService {
  calculateSLADeadline(priority) {
    const hours = SLA_TIMES[priority] || SLA_TIMES.medium;
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  getSLAStatus(deadline) {
    const now = new Date();
    const timeLeft = deadline - now;
    
    if (timeLeft < 0) {
      return { status: 'breached', color: 'red' };
    }
    
    const totalTime = SLA_TIMES.medium * 60 * 60 * 1000;
    const percentage = (timeLeft / totalTime) * 100;
    
    if (percentage < 25) {
      return { status: 'critical', color: 'orange' };
    }
    
    return { status: 'on-track', color: 'green' };
  }
}

module.exports = new SLAService();
