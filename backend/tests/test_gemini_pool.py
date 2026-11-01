import pytest
from app.services.gemini_pool import GeminiKeyManager

@pytest.mark.asyncio
async def test_key_rotation_and_failover():
    keys = ["key_alpha", "key_beta", "key_gamma"]
    mgr = GeminiKeyManager(keys=keys)
    
    assert mgr.total_keys == 3
    assert mgr.get_active_key() == "key_alpha"

    # Simulate rotation on error
    next_key = await mgr.rotate_to_next_key(failed_key="key_alpha", reason="429 ResourceExhausted")
    assert next_key == "key_beta"
    assert mgr.get_active_key() == "key_beta"
    assert mgr.failure_counts["key_alpha"] == 1

    # Simulate second rotation
    next_key = await mgr.rotate_to_next_key(failed_key="key_beta", reason="503 Service Unavailable")
    assert next_key == "key_gamma"
    assert mgr.get_active_key() == "key_gamma"

    # Wrap around to key_alpha
    next_key = await mgr.rotate_to_next_key()
    assert next_key == "key_alpha"

