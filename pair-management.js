document.addEventListener("DOMContentLoaded", function() {
      // Load current pair info
      function loadPairInfo() {
        const pairCode = localStorage.getItem('currentPairId');
        const userRole = localStorage.getItem('currentUser');
        
        if (pairCode && userRole) {
          document.getElementById('pair-code-display').textContent = `Code: ${pairCode}`;
          document.getElementById('user-role-display').textContent = `Role: ${userRole === 'he' ? 'Dominant' : 'Submissive'}`;
          document.getElementById('copy-pair-code-btn').style.display = 'inline-block';
        } else {
          document.getElementById('copy-pair-code-btn').style.display = 'none';
        }
      }

      // Copy pair code functionality
      function copyPairCode() {
        const pairCode = localStorage.getItem('currentPairId');
        if (!pairCode) return;

        if (navigator.clipboard) {
          navigator.clipboard.writeText(pairCode).then(() => {
            NotificationManager.show("Pair code copied to clipboard!", 'success');
          }).catch(() => {
            fallbackCopy(pairCode);
          });
        } else {
          fallbackCopy(pairCode);
        }
      }

      function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          NotificationManager.show("Pair code copied!", 'success');
        } catch (err) {
          NotificationManager.show("Failed to copy code", 'error');
        }
        document.body.removeChild(textArea);
      }

      // Create new pair
      document.getElementById('create-new-pair-btn').addEventListener('click', async () => {
        try {
          const pairCode = Math.random().toString(36).substr(2, 6).toUpperCase();
          const userRole = 'he'; // Default to dominant for creator
          const userUID = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
          
          await db.collection("pairs").doc(pairCode).set({
            createdAt: new Date(),
            createdBy: userRole,
            users: [userRole]
          });

          localStorage.setItem('currentPairId', pairCode);
          localStorage.setItem('currentUser', userRole);
          localStorage.setItem('userUID', userUID);
          
          loadPairInfo();
          // Copy to clipboard
          if (navigator.clipboard) {
            navigator.clipboard.writeText(pairCode).then(() => {
              NotificationManager.show(`Pair created! Code ${pairCode} copied to clipboard!`, 'success', 5000);
            }).catch(() => {
              NotificationManager.show(`Pair created! Code: ${pairCode}`, 'success', 5000);
            });
          } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = pairCode;
            document.body.appendChild(textArea);
            textArea.select();
            try {
              document.execCommand('copy');
              NotificationManager.show(`Pair created! Code ${pairCode} copied to clipboard!`, 'success', 5000);
            } catch (err) {
              NotificationManager.show(`Pair created! Code: ${pairCode}`, 'success', 5000);
            }
            document.body.removeChild(textArea);
          }
        } catch (error) {
          NotificationManager.show('Error creating pair', 'error');
        }
      });

      // Join pair
      document.getElementById('join-pair-btn').addEventListener('click', () => {
        document.getElementById('join-modal').style.display = 'flex';
      });

      document.getElementById('confirm-join').addEventListener('click', async () => {
        const pairCode = document.getElementById('join-code-input').value.trim().toUpperCase();
        if (pairCode.length !== 6) {
          NotificationManager.show('Please enter a 6-digit code', 'error');
          return;
        }

        try {
          const pairDoc = await db.collection("pairs").doc(pairCode).get();
          if (!pairDoc.exists) {
            NotificationManager.show('Pair code not found', 'error');
            return;
          }

          const userRole = 'she'; // Default to submissive for joiner
          const userUID = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
          
          localStorage.setItem('currentPairId', pairCode);
          localStorage.setItem('currentUser', userRole);
          localStorage.setItem('userUID', userUID);
          
          document.getElementById('join-modal').style.display = 'none';
          loadPairInfo();
          NotificationManager.show('Successfully joined pair!', 'success');
        } catch (error) {
          NotificationManager.show('Error joining pair', 'error');
        }
      });

      // Leave pair
      document.getElementById('leave-pair-btn').addEventListener('click', () => {
        NotificationManager.showConfirmation(
          "Are you sure you want to leave this pair?",
          () => {
            localStorage.removeItem('currentPairId');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userUID');
            loadPairInfo();
            NotificationManager.show('Left pair successfully', 'success');
          }
        );
      });

      // Close modal
      document.getElementById('close-join').addEventListener('click', () => {
        document.getElementById('join-modal').style.display = 'none';
      });

      // Copy pair code button
      document.getElementById('copy-pair-code-btn').addEventListener('click', copyPairCode);

      loadPairInfo();
    });
