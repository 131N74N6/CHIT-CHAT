import type { RoomIntrf } from '../models/room.model';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useRoomStore } from '../stores/room.store';
import { useUserStore } from '../stores/user.store';
import { useMessageStore } from '../stores/message.store';

export default function useRoomProfileService() {
    
}