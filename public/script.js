document.addEventListener('DOMContentLoaded', () => {
    const scheduleList = document.getElementById('schedule-list');
    const categorySearchInput = document.getElementById('category-search');
    let allScheduleItems = []; // Store all items for filtering

    // Function to format time
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    // Function to render the schedule
    const renderSchedule = (itemsToRender) => {
        scheduleList.innerHTML = ''; // Clear previous items

        if (itemsToRender.length === 0) {
            scheduleList.innerHTML = '<p>No talks found matching your criteria.</p>';
            return;
        }

        itemsToRender.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('schedule-item', item.type);

            if (item.type === 'talk') {
                itemElement.innerHTML = `
                    <p class="time">${formatTime(item.startTime)} - ${formatTime(item.endTime)}</p>
                    <h3>${item.title}</h3>
                    <p class="speakers"><strong>Speakers:</strong> ${item.speakers.join(', ')}</p>
                    <p class="category"><strong>Category:</strong> ${item.category.join(', ')}</p>
                    <p class="description">${item.description}</p>
                `;
            } else if (item.type === 'break') {
                itemElement.innerHTML = `
                    <p class="time">${formatTime(item.startTime)} - ${formatTime(item.endTime)}</p>
                    <h3>${item.title}</h3>
                `;
            } else if (item.type === 'transition') {
                itemElement.innerHTML = `
                    <p class="time">${formatTime(item.startTime)} - ${formatTime(item.endTime)}</p>
                    <p>${item.title}</p>
                `;
            }
            scheduleList.appendChild(itemElement);
        });
    };

    // Fetch schedule data from the server
    fetch('/api/talks')
        .then(response => response.json())
        .then(data => {
            allScheduleItems = data;
            renderSchedule(allScheduleItems);
        })
        .catch(error => {
            console.error('Error fetching schedule data:', error);
            scheduleList.innerHTML = '<p>Failed to load schedule. Please try again later.</p>';
        });

    // Search functionality
    categorySearchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();

        if (!searchTerm) {
            renderSchedule(allScheduleItems); // Show all if search box is empty
            return;
        }

        const filteredItems = allScheduleItems.filter(item => {
            if (item.type === 'talk' && item.category) {
                return item.category.some(cat => cat.toLowerCase().includes(searchTerm));
            }
            return false; // Only filter talks by category
        });

        renderSchedule(filteredItems);
    });
});
